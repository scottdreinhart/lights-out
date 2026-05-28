import '@/styles.css'
import { App } from '@/ui'
import ReactDOM from 'react-dom/client'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root).render(<App />)
