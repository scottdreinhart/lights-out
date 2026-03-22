import { useEffect } from 'react'

interface PerformanceMetrics {
	lcp?: number
	cls?: number
	fcp?: number
	ttfb?: number
}

declare global {
	interface Window {
		webVitals?: PerformanceMetrics
	}
}

export const usePerformanceMetrics = () => {
	useEffect(() => {
		if (!window.webVitals) {
			window.webVitals = {}
		}

		const lcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries()
			const lastEntry = entries[entries.length - 1]
			window.webVitals!.lcp = (lastEntry as any).renderTime || (lastEntry as any).loadTime
		})
		try {
			lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
		} catch {
			return
		}

		let clsValue = 0
		const clsObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (!(entry as any).hadRecentInput) {
					clsValue += (entry as any).value
					window.webVitals!.cls = clsValue
				}
			}
		})
		try {
			clsObserver.observe({ entryTypes: ['layout-shift'] })
		} catch {
			return
		}

		const fcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries()
			if (entries.length > 0) {
				window.webVitals!.fcp = entries[0].startTime
			}
		})
		try {
			fcpObserver.observe({ entryTypes: ['paint'] })
		} catch {
			return
		}

		return () => {
			lcpObserver.disconnect()
			clsObserver.disconnect()
			fcpObserver.disconnect()
		}
	}, [])

	return window.webVitals || {}
}

export const logWebVitals = () => {
	if (typeof window === 'undefined') {
		return
	}

	window.addEventListener('beforeunload', () => {
		const metrics = window.webVitals || {}
		console.warn('Web Vitals:', {
			lcp: metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'not captured',
			cls: metrics.cls ? metrics.cls.toFixed(3) : 'not captured',
			fcp: metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'not captured',
		})
	})
}