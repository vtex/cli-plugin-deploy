export const Messages = {
  DEPLOY_START: (app: string) => `Starting to deploy app: ${app}`,
  DEPLOY_SUCCESS: (app: string) => `Successfully deployed ${app}`,
  DEPLOY_ALREADY_ERROR: (app: string) => `App ${app} was already deployed.`,
}
