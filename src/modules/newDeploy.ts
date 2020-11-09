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

import { QueryStringInfo } from '@vtex/api'

interface AppData {
  vendor: string
  name: string
  version: string
}

const switchToVendorMessage = (vendor: string): string => {
  return `You are trying to deploy this app in an account that differs from the indicated vendor. Do you want to deploy in account ${chalk.blue(
    vendor
  )}?`
}

const promptDeploy = (app: string) => promptConfirm(`Are you sure you want to deploy app ${app}`)
const promptDeployForce = () =>
  promptConfirm(`Are you sure you want to ignore the minimum testing period of 7 minutes after publish?`)

const execRelease = async (appInfo: AppData, sessionToken: string, force: boolean) => {
  const context = { account: appInfo.vendor, workspace: 'master', authToken: sessionToken }
  const registry = createRegistryClient(context)
  const path = `${appInfo.vendor}.${appInfo.name}`
  const appQueryString: QueryStringInfo = {
    name: 'ignoreWaitPeriod',
    value: force,
  }

  await registry.validateApp(path, appInfo.version, appQueryString)
}

const deployRelease = async (app: string, force: boolean): Promise<boolean> => {
  const { vendor, name, version } = parseLocator(app)
  const appInfo: AppData = { vendor, name, version }
  const session = SessionManager.getSingleton()

  if (appInfo.vendor !== session.account) {
    const canSwitchToVendor = await promptConfirm(switchToVendorMessage(appInfo.vendor))

    if (!canSwitchToVendor) {
      return false
    }

    await switchAccount(appInfo.vendor, {})
  }

  await execRelease(appInfo, session.token, force)

  return true
}

// @ts-ignore
const prepareDeploy = async (app, originalAccount, originalWorkspace: string, force: boolean): Promise<void> => {
  app = ManifestValidator.validateApp(app)
  try {
    logger.debug(Messages.DEPLOY_START(app))
    const deployed = await deployRelease(app, force)

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
export default async (optionalApp: string, options) => {
  const preConfirm = options.y || options.yes
  const force = options.f || options.force || false

  const { account: originalAccount, workspace: originalWorkspace } = SessionManager.getSingleton()
  const app = optionalApp || (await ManifestEditor.getManifestEditor()).appLocator

  if (!preConfirm && !(await promptDeploy(app))) {
    return
  }

  if (force && !(await promptDeployForce())) {
    return
  }

  logger.debug(`Deploying app ${app}`)

  return prepareDeploy(app, originalAccount, originalWorkspace, force)
}
