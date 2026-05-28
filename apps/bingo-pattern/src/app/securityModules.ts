import * as sharedApiClient from '@games/shared-api-client'
import * as sharedConfig from '@games/shared-config'
import * as sharedSanitizers from '@games/shared-sanitizers'
import * as sharedValidators from '@games/shared-validators'

export const securityModules = {
  validators: sharedValidators,
  sanitizers: sharedSanitizers,
  config: sharedConfig,
  apiClient: sharedApiClient,
}

export const securityModulesReady = Boolean(
  securityModules.validators &&
  securityModules.sanitizers &&
  securityModules.config &&
  securityModules.apiClient,
)
