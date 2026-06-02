/**
 * CSS Module Mock for Vitest
 *
 * Prevents "Cannot find module" errors when CSS modules are imported in tests.
 * Returns a proxy object that accepts any CSS class name and returns it as-is.
 *
 * Usage: Vitest automatically substitutes all .css and .module.css imports
 * with this mock via the alias configuration.
 */

export default new Proxy(
  {},
  {
    get: (_target, _prop) => _prop,
  },
)
