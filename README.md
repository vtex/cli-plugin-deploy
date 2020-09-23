# VTEX CLI Plugin Template

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
* [VTEX CLI Plugin Template](#vtex-cli-plugin-template)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @vtex/cli-plugin-template
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@vtex/cli-plugin-template/0.0.0 linux-x64 node-v12.18.3
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example hello [FILE]`](#oclif-example-hello-file)

## `oclif-example hello [FILE]`

describe the command here

```
USAGE
  $ oclif-example hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
  -v, --verbose    Show debug level logs
  --trace          Ensure all requests to VTEX IO are traced

EXAMPLE
  $ oclif-example hello
  hello world from ./src/hello.ts!
```

_See code: [build/commands/hello.ts](https://github.com/vtex/cli-plugin-template/blob/v0.0.0/build/commands/hello.ts)_
<!-- commandsstop -->
