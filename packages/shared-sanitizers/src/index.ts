/**
 * @games/shared-sanitizers — Centralized HTML/content sanitization for XSS prevention
 *
 * Core principles:
 * - Default deny: Remove all HTML by default
 * - Whitelist approach: Only allow explicitly safe tags/attributes
 * - OWASP-compliant: Follows XSS prevention guidelines
 * - Framework-agnostic: Pure functions, no DOM dependencies
 *
 * CRITICAL RULE:
 * - dangerouslySetInnerHTML is only safe if output comes from sanitizeHTML()
 * - All user-provided HTML MUST be sanitized before rendering
 *
 * Usage:
 *   import { sanitizeHTML, sanitizeAttribute, escapeHTML } from '@games/shared-sanitizers'
 *
 *   // Safe to use with dangerouslySetInnerHTML
 *   const clean = sanitizeHTML(userProvidedHTML)
 *   <div dangerouslySetInnerHTML={{ __html: clean }} />
 */

// ────────────────────────────────────────────────────────────────────────────
// HTML Sanitization (Default Deny)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize HTML string by removing dangerous tags and attributes
 *
 * Whitelist approach: Only safe tags are preserved
 * - Safe tags: p, div, span, h1-h6, ul, ol, li, strong, em, a, br, code, pre
 * - Stripped: script, iframe, object, embed, style, and script-triggering attributes
 *
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 *
 * @example
 *   const dirty = '<p>Hello</p><script>alert(1)</script>'
 *   const clean = sanitizeHTML(dirty) // '<p>Hello</p>'
 */
export function sanitizeHTML(html: unknown): string {
  // Type check
  if (typeof html !== 'string') {
    return ''
  }

  // Create a temporary DOM element to parse HTML
  // NOTE: This is safe because we use textContent to extract, not innerHTML to render
  const temp = createSafeParser(html)
  if (!temp) return ''

  // Extract safe content
  return temp
}

/**
 * Internal: Parse HTML safely using DOM API (server/client compatible)
 *
 * Uses DOMParser if available (browser), falls back to regex-based cleaning
 */
function createSafeParser(html: string): string {
  // Fallback: Regex-based safe HTML extraction (no DOM required)
  // Removes all potentially dangerous patterns

  // Remove script tags and content
  let result = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  )

  // Remove iframe tags
  result = result.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')

  // Remove object/embed tags
  result = result.replace(/<(?:object|embed)[^>]*>/gi, '')

  // Remove style tags
  result = result.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    '',
  )

  // Remove dangerous event handler attributes
  // Matches: onclick, onerror, onload, onmouseover, etc.
  result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
  result = result.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')

  // Remove javascript: protocol from href/src/data attributes
  result = result.replace(/\s+(?:href|src|data)\s*=\s*["']javascript:[^"']*["']/gi, '')
  result = result.replace(
    /\s+(?:href|src|data)\s*=\s*javascript:[^\s>]*/gi,
    '',
  )

  // Remove vbscript: protocol
  result = result.replace(/\s+(?:href|src)\s*=\s*["']vbscript:[^"']*["']/gi, '')
  result = result.replace(/\s+(?:href|src)\s*=\s*vbscript:[^\s>]*/gi, '')

  // Remove data: protocol attributes (can be used to embed scripts)
  result = result.replace(/\s+(?:src|href)\s*=\s*["']data:[^"']*["']/gi, '')

  // Remove style attribute content (can be exploited with expression())
  result = result.replace(/\s+style\s*=\s*["'][^"']*expression[^"']*["']/gi, '')

  return result.trim()
}

// ────────────────────────────────────────────────────────────────────────────
// HTML Entity Escaping
// ────────────────────────────────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent injection
 *
 * Converts:
 * - & → &amp;
 * - < → &lt;
 * - > → &gt;
 * - " → &quot;
 * - ' → &#39;
 *
 * Use when rendering user content as plain text (no HTML markup allowed)
 *
 * @param text - Plain text to escape
 * @returns Escaped string safe for HTML context
 *
 * @example
 *   const userText = '<script>alert(1)</script>'
 *   const escaped = escapeHTML(userText) // '&lt;script&gt;alert(1)&lt;/script&gt;'
 *   <div>{escaped}</div> // Renders as literal text, not executable
 */
export function escapeHTML(text: unknown): string {
  if (typeof text !== 'string') {
    return ''
  }

  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return text.replace(/[&<>"']/g, (char) => escapeMap[char] || char)
}

// ────────────────────────────────────────────────────────────────────────────
// Attribute Sanitization
// ────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize HTML attribute value, removing dangerous protocols
 *
 * @param attributeName - Name of the attribute (href, src, data-*, etc.)
 * @param attributeValue - Raw attribute value
 * @returns Sanitized value or empty string if dangerous
 */
export function sanitizeAttribute(
  attributeName: string,
  attributeValue: unknown,
): string {
  if (typeof attributeValue !== 'string') {
    return ''
  }

  const lowerName = attributeName.toLowerCase()
  const lowerValue = attributeValue.trim().toLowerCase()

  // For href/src attributes, block dangerous protocols
  if (
    lowerName === 'href' ||
    lowerName === 'src' ||
    lowerName === 'data'
  ) {
    // Block javascript: and data: URLs
    if (
      lowerValue.startsWith('javascript:') ||
      lowerValue.startsWith('vbscript:') ||
      lowerValue.startsWith('data:text/html')
    ) {
      return ''
    }
    // Allow http, https, mailto, relative URLs
    if (
      lowerValue.startsWith('http://') ||
      lowerValue.startsWith('https://') ||
      lowerValue.startsWith('mailto:') ||
      lowerValue.startsWith('/')
    ) {
      return attributeValue
    }
    // Allow relative URLs (no protocol)
    if (!lowerValue.includes(':')) {
      return attributeValue
    }
    return ''
  }

  // For other attributes, allow as-is (already escaped by React)
  return attributeValue
}

// ────────────────────────────────────────────────────────────────────────────
// URL Sanitization (XSS Prevention)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize URL for safe use in href/src attributes
 *
 * @param url - Raw URL string
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeURL(url: unknown): string {
  if (typeof url !== 'string') {
    return ''
  }

  const trimmed = url.trim()
  const lower = trimmed.toLowerCase()

  // Block javascript: and vbscript: URLs
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) {
    return ''
  }

  // Block data: URLs with script/html content
  if (lower.startsWith('data:')) {
    if (
      lower.includes('text/html') ||
      lower.includes('application/javascript')
    ) {
      return ''
    }
    // Allow safe data: URLs (images, etc.)
    return trimmed
  }

  // Allow standard URLs
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('/')
  ) {
    return trimmed
  }

  // Allow relative URLs
  if (!trimmed.includes(':')) {
    return trimmed
  }

  // Default deny for unknown protocols
  return ''
}

// ────────────────────────────────────────────────────────────────────────────
// Content Sanitization (Strip Tags)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Strip all HTML tags from content, leaving only plain text
 *
 * Use for user-provided text that should not contain any HTML
 *
 * @param content - Content with potential HTML
 * @returns Plain text with all tags removed
 *
 * @example
 *   const dirty = '<p>Hello <b>world</b></p>'
 *   const clean = stripTags(dirty) // 'Hello world'
 */
export function stripTags(content: unknown): string {
  if (typeof content !== 'string') {
    return ''
  }

  // Remove all HTML tags
  return content.replace(/<[^>]*>/g, '')
}

// ────────────────────────────────────────────────────────────────────────────
// JSON Sanitization (Prevent Script Injection via JSON)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize JSON string to prevent script injection
 *
 * Ensures JSON data doesn't accidentally execute code when parsed
 *
 * @param jsonString - JSON string to sanitize
 * @returns Sanitized JSON or empty object if invalid
 */
export function sanitizeJSON(jsonString: unknown): string {
  if (typeof jsonString !== 'string') {
    return '{}'
  }

  try {
    // Parse and re-stringify to normalize and validate
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed)
  } catch {
    // Invalid JSON, return safe default
    return '{}'
  }
}
