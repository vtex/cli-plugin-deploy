import { flags as oclifFlags } from '@oclif/command'

import { CustomCommand, ToolbeltConfig } from 'vtex'

import { ColorifyConstants } from 'vtex'
import chalk from 'chalk'

import oldAppsDeploy from '../modules/oldDeploy'
import newAppsDeploy from '../modules/newDeploy'

export default class Deploy extends CustomCommand {
  static description = `Publishes an app as a stable version. Only works for apps previously published as a release candidate [see ${ColorifyConstants.COMMAND_OR_VTEX_REF('vtex publish --help')}].`

  static examples = [`${ColorifyConstants.COMMAND_OR_VTEX_REF('vtex deploy')}`, `${ColorifyConstants.COMMAND_OR_VTEX_REF('vtex deploy')} vtex.service-example@0.0.1`]

  static flags = {
    ...CustomCommand.globalFlags,
    yes: oclifFlags.boolean({ char: 'y', description: 'Answers yes to all prompts.' }),
    force: oclifFlags.boolean({ char: 'f', description: `Ignores the testing period of 7 minutes after publishing an app. ${chalk.yellow('(Use with caution.)')}` }),
  }

  static args = [{ name: 'appId', description: `Name and version of the app ${ColorifyConstants.ID('({vendor}.{appname}@{x.x.x})')} you want to deploy.` }]
  async run() {
    const configClient = ToolbeltConfig.createClient()
    const { featureFlags } = await configClient.getGlobalConfig()

    if (featureFlags.FEATURE_FLAG_DEPLOY_PLUGIN) {
      const {
        args: { appId },
        flags: { yes, force },
      } = this.parse(Deploy)

      await newAppsDeploy(appId, { yes, force })
    } else {
      const {
        args: { appId },
        flags: { yes },
      } = this.parse(Deploy)

      await oldAppsDeploy(appId, { yes })
    }
  }
}
