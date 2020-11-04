import { flags as oclifFlags } from '@oclif/command'

import { CustomCommand, ToolbeltConfig } from 'vtex'

import oldAppsDeploy from '../modules/oldDeploy'
import newAppsDeploy from '../modules/newDeploy'

export default class Deploy extends CustomCommand {
  static description = 'Deploy a release of an app'

  static examples = ['vtex deploy', 'vtex deploy vtex.service-example@0.0.1']

  static flags = {
    ...CustomCommand.globalFlags,
    yes: oclifFlags.boolean({ char: 'y', description: 'Answer yes to confirmation prompts' }),
    force: oclifFlags.boolean({ char: 'f', description: 'Force deploy' }),
  }

  static args = [{ name: 'appId' }]
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
