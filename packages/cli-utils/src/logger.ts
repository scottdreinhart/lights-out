// ANSI color codes
export const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  YELLOW: '\x1b[93m',
  WHITE: '\x1b[97m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  GRAY: '\x1b[90m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
} as const;

/**
 * Standardized boxed header for terminal output
 */
export function boxedHeader(title: string, color: string = COLORS.BLUE): void {
  const width = Math.min(process.stdout.columns || 80, 80);
  const horizontalLine = '═'.repeat(width - 2);
  
  console.log(`\n${COLORS.WHITE}╔${horizontalLine}╗${COLORS.RESET}`);
  
  // Center the title
  const paddingTotal = width - 2 - title.length;
  const paddingLeft = Math.floor(paddingTotal / 2);
  const paddingRight = paddingTotal - paddingLeft;
  
  console.log(`${COLORS.WHITE}║${' '.repeat(paddingLeft)}${COLORS.BOLD}${color}${title}${COLORS.RESET}${COLORS.WHITE}${' '.repeat(paddingRight)}║${COLORS.RESET}`);
  console.log(`${COLORS.WHITE}╚${horizontalLine}╝${COLORS.RESET}\n`);
}

/**
 * Log a success message with green checkmark
 */
export function logSuccess(message: string): void {
  console.log(`${COLORS.GREEN}✅ ${message}${COLORS.RESET}`);
}

/**
 * Log an error message with red cross
 */
export function logError(message: string): void {
  console.error(`${COLORS.RED}❌ ${message}${COLORS.RESET}`);
}

/**
 * Log a warning message with yellow warning sign
 */
export function logWarning(message: string): void {
  console.log(`${COLORS.YELLOW}⚠️  ${message}${COLORS.RESET}`);
}

/**
 * Log an info message with blue info sign
 */
export function logInfo(message: string): void {
  console.log(`${COLORS.CYAN}ℹ️  ${message}${COLORS.RESET}`);
}

/**
 * Log a step in a multi-step process
 */
export function logStep(current: number, total: number, message: string): void {
  console.log(`${COLORS.MAGENTA}[${current}/${total}] 🧪 ${message}${COLORS.RESET}`);
}
