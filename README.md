# VTEX CLI Plugin Deploy

Extend the `vtex` toolbelt!

## Developing

1. Clone `vtex/toolbelt` and follow the steps on the Contributing section.
2. Clone/Create a plugin with this template.
3. Change the template name under this project's `package.json`.
2. Run `yarn link` on this project.
3. Now run `vtex link @vtex/cli-plugin-template` (or the new name) on the `vtex/toolbelt` project.
4. Run `yarn watch` on the `vtex/toolbelt`
5. Test the command on a VTEX IO app with `vtex-test hello`

For more information, read [Ocliff Docs](https://oclif.io/docs/introduction).

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
![npm](https://img.shields.io/npm/v/@vtex/cli-plugin-template)

<!-- toc -->
* [VTEX CLI Plugin Deploy](#vtex-cli-plugin-deploy)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @vtex/cli-plugin-deploy
$ vtex COMMAND
running command...
$ vtex (-v|--version|version)
@vtex/cli-plugin-deploy/0.1.0 linux-x64 node-v12.18.4
$ vtex --help [COMMAND]
USAGE
  $ vtex COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vtex deploy [APPID]`](#vtex-deploy-appid)

## `vtex deploy [APPID]`

Deploy a release of an app

```
USAGE
  $ vtex deploy [APPID]

OPTIONS
  -h, --help     show CLI help
  -v, --verbose  Show debug level logs
  -y, --yes      Answer yes to confirmation prompts
  --trace        Ensure all requests to VTEX IO are traced

EXAMPLES
  vtex deploy
  vtex deploy vtex.service-example@0.0.1
```

_See code: [build/commands/deploy.ts](https://github.com/vtex/cli-plugin-deploy/blob/v0.1.0/build/commands/deploy.ts)_
<!-- commandsstop -->
