import chalk from 'chalk'
import { Messages } from '../lib/constants/Messages'
import {
  createRegistryClient,
  parseLocator,
  logger,
  ManifestEditor,
  ManifestValidator,
  promptConfirm,
  SessionManager,
  returnToPreviousAccount,
  switchAccount,
} from 'vtex'

const switchToVendorMessage = (vendor: string): string => {
  return `You are trying to deploy this app in an account that differs from the indicated vendor. Do you want to deploy in account ${chalk.blue(
    vendor
  )}?`
}

const promptDeploy = (app: string) => promptConfirm(`Are you sure you want to deploy app ${app}`)

const deployRelease = async (app: string): Promise<boolean> => {
  const { vendor, name, version } = parseLocator(app)
  const session = SessionManager.getSingleton()

  if (vendor !== session.account) {
    const canSwitchToVendor = await promptConfirm(switchToVendorMessage(vendor))

    if (!canSwitchToVendor) {
      return false
    }

    await switchAccount(vendor, {})
  }

  const context = { account: vendor, workspace: 'master', authToken: session.token }
  const registry = createRegistryClient(context)

  await registry.validateApp(`${vendor}.${name}`, version)

  return true
}

// @ts-ignore
const prepareDeploy = async (app, originalAccount, originalWorkspace: string): Promise<void> => {
  app = ManifestValidator.validateApp(app)
  try {
    logger.debug(Messages.DEPLOY_START(app))
    const deployed = await deployRelease(app)

    if (deployed) {
      logger.info(Messages.DEPLOY_SUCCESS(app))
    }
  } catch (e) {
    const data = e.response?.data
    const code = data?.code

    if (code === 'app_is_not_rc') {
      logger.error(Messages.DEPLOY_ALREADY_ERROR(app))
    } else if (data?.message) {
      logger.error(data.message)
    } else {
      await returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace })
      throw e
    }
  }

  await returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace })
}

// @ts-ignore
export default async (optionalApp: string, options, pipeline) => {
  const preConfirm = options.y || options.yes

  const { account: originalAccount, workspace: originalWorkspace } = SessionManager.getSingleton()
  const app = optionalApp || (await ManifestEditor.getManifestEditor()).appLocator

  if (!pipeline && !preConfirm && !(await promptDeploy(app))) {
    return
  }

  logger.info('Deploying app in pipeline mode')

  logger.debug(`Deploying app ${app}`)

  return prepareDeploy(app, originalAccount, originalWorkspace)
}
