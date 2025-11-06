# Vercel CLI Overview

Copy page

Ask AI about this page

Last updated March 13, 2025

Vercel gives you multiple ways to interact with and configure your Vercel Projects. With the command-line interface (CLI) you can interact with the Vercel platform using a terminal, or through an automated system, enabling you to [retrieve logs](/docs/cli/logs), manage [certificates](/docs/cli/certs), replicate your deployment environment [locally](/docs/cli/dev), manage Domain Name System (DNS) [records](/docs/cli/dns), and more.

If you'd like to interface with the platform programmatically, check out the [REST API documentation](/docs/rest-api).

## [Installing Vercel CLI](#installing-vercel-cli)

To download and install Vercel CLI, run the following command:

pnpmyarnnpmbun

```
pnpm i -g vercel
```

## [Updating Vercel CLI](#updating-vercel-cli)

When there is a new release of Vercel CLI, running any command will show you a message letting you know that an update is available.

If you have installed our command-line interface through [npm](http://npmjs.org/) or [Yarn](https://yarnpkg.com), the easiest way to update it is by running the installation command yet again.

pnpmyarnnpmbun

```
pnpm i -g vercel@latest
```

If you see permission errors, please read npm's [official guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally). Yarn depends on the same configuration as npm.

## [Checking the version](#checking-the-version)

The `--version` option can be used to verify the version of Vercel CLI currently being used.

terminal

```
vercel --version
```

Using the `vercel` command with the `--version` option.

## [Using in a CI/CD environment](#using-in-a-ci/cd-environment)

Vercel CLI requires you to log in and authenticate before accessing resources or performing administrative tasks. In a terminal environment, you can use [`vercel login`](/docs/cli/login), which requires manual input. In a CI/CD environment where manual input is not possible, you can create a token on your [tokens page](/account/tokens) and then use the [`--token` option](/docs/cli/global-options#token) to authenticate.

## [Available Commands](#available-commands)

[\- alias](/docs/cli/alias)

[\- bisect](/docs/cli/bisect)

[\- blob](/docs/cli/blob)

[\- build](/docs/cli/build)

[\- certs](/docs/cli/certs)

[\- curl](/docs/cli/curl)

[\- deploy](/docs/cli/deploy)

[\- dev](/docs/cli/dev)

[\- dns](/docs/cli/dns)

[\- domains](/docs/cli/domains)

[\- env](/docs/cli/env)

[\- git](/docs/cli/git)

[\- help](/docs/cli/help)

[\- init](/docs/cli/init)

[\- inspect](/docs/cli/inspect)

[\- link](/docs/cli/link)

[\- list](/docs/cli/list)

[\- login](/docs/cli/login)

[\- logout](/docs/cli/logout)

[\- logs](/docs/cli/logs)

[\- project](/docs/cli/project)

[\- promote](/docs/cli/promote)

[\- pull](/docs/cli/pull)

[\- redeploy](/docs/cli/redeploy)

[\- remove](/docs/cli/remove)

[\- rollback](/docs/cli/rollback)

[\- rolling-release](/docs/cli/rolling-release)

[\- switch](/docs/cli/switch)

[\- teams](/docs/cli/teams)

[\- whoami](/docs/cli/whoami)

# Deploying Projects from Vercel CLI

Copy page

Ask AI about this page

Last updated September 24, 2025

## [Deploying from source](#deploying-from-source)

The `vercel` command is used to [deploy](/docs/cli/deploy) Vercel Projects and can be used from either the root of the Vercel Project directory or by providing a path.

terminal

```
vercel
```

Deploys the current Vercel project, when run from the Vercel Project root.

You can alternatively use the [`vercel deploy` command](/docs/cli/deploy) for the same effect, if you want to be more explicit.

terminal

```
vercel [path-to-project]
```

Deploys the Vercel project found at the provided path, when it's a Vercel Project root.

When deploying, stdout is always the Deployment URL.

terminal

```
vercel > deployment-url.txt
```

Writes the Deployment URL output from the `deploy` command to a text file.

### [Relevant commands](#relevant-commands)

*   [deploy](/docs/cli/deploy)

## [Deploying a staged production build](#deploying-a-staged-production-build)

By default, when you promote a deployment to production, your domain will point to that deployment. If you want to create a production deployment without assigning it to your domain, for example to avoid sending all of your traffic to it, you can:

1.  Turn off the auto-assignment of domains for the current production deployment:

terminal

```
vercel --prod --skip-domain
```

1.  When you are ready, manually promote the staged deployment to production:

terminal

```
vercel promote [deployment-id or url]
```

### [Relevant commands](#relevant-commands)

*   [promote](/docs/cli/promote)
*   [deploy](/docs/cli/deploy)

## [Deploying from local build (prebuilt)](#deploying-from-local-build-prebuilt)

You can build Vercel projects locally to inspect the build outputs before they are [deployed](/docs/cli/deploy). This is a great option for producing builds for Vercel that do not share your source code with the platform.

It's also useful for debugging build outputs.

terminal

```
vercel build
```

Using the `vercel` command to deploy and write stdout to a text file.

This produces `.vercel/output` in the [Build Output API](/docs/build-output-api/v3) format. You can review the output, then [deploy](/docs/cli/deploy) with:

terminal

```
vercel deploy --prebuilt
```

Deploy the build outputs in `.vercel/output` produced by `vercel build`.

Review the [When not to use --prebuilt](/docs/cli/deploy#when-not-to-use---prebuilt) section to understand when you should not use the `--prebuilt` flag.

See more details at [Build Output API](/docs/build-output-api/v3).

### [Relevant commands](#relevant-commands)

*   [build](/docs/cli/build)
*   [deploy](/docs/cli/deploy)

# Linking Projects with Vercel CLI

Copy page

Ask AI about this page

Last updated July 18, 2025

When running `vercel` in a directory for the first time, Vercel CLI needs to know which [scope](/docs/dashboard-features#scope-selector) and [Vercel Project](/docs/projects/overview) you want to [deploy](/docs/cli/deploy) your directory to. You can choose to either [link](/docs/cli/link) an existing Vercel Project or to create a new one.

terminal

```
vercel
? Set up and deploy "~/web/my-lovely-project"? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] y
? What’s the name of your existing project? my-lovely-project
🔗 Linked to awesome-team/my-lovely-project (created .vercel and added it to .gitignore)
```

Linking an existing Vercel Project when running Vercel CLI in a new directory.

Once set up, a new `.vercel` directory will be added to your directory. The `.vercel` directory contains both the organization and `id` of your Vercel Project. If you want [unlink](/docs/cli/link) your directory, you can remove the `.vercel` directory.

You can use the [`--yes` option](/docs/cli/deploy#yes) to skip these questions.

## [Framework detection](#framework-detection)

When you create a new Vercel Project, Vercel CLI will [link](/docs/cli/link) the Vercel Project and automatically detect the framework you are using and offer default Project Settings accordingly.

terminal

```
vercel
? Set up and deploy "~/web/my-new-project"? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] n
? What’s your project’s name? my-new-project
? In which directory is your code located? my-new-project/
Auto-detected project settings (Next.js):
- Build Command: \`next build\` or \`build\` from \`package.json\`
- Output Directory: Next.js default
- Development Command: next dev --port $PORT
? Want to override the settings? [y/N]
```

Creating a new Vercel Project with the `vercel` command.

You will be provided with default Build Command, Output Directory, and Development Command options.

You can continue with the default Project Settings or overwrite them. You can also edit your Project Settings later in your Vercel Project dashboard.

## [Relevant commands](#relevant-commands)

*   [deploy](/docs/cli/deploy)
*   [link](/docs/cli/link)

# Telemetry

Copy page

Ask AI about this page

Last updated September 24, 2025

Participation in this program is optional, and you may [opt-out](#how-do-i-opt-out-of-vercel-cli-telemetry) if you would prefer not to share any telemetry information.

## [Why is telemetry collected?](#why-is-telemetry-collected)

Vercel CLI Telemetry provides an accurate gauge of Vercel CLI feature usage, pain points, and customization across all users. This data enables tailoring the Vercel CLI to your needs, supports its continued growth relevance, and optimal developer experience, as well as verifies if improvements are enhancing the baseline performance of all applications.

## [What is being collected?](#what-is-being-collected)

Vercel takes privacy and security seriously. Vercel CLI Telemetry tracks general usage information, such as commands and arguments used. Specifically, the following are tracked:

*   Command invoked (`vercel build`, `vercel deploy`, `vercel login`, etc.)
*   Version of the Vercel CLI
*   General machine information (e.g. number of CPUs, macOS/Windows/Linux, whether or not the command was run within CI)

This list is regularly audited to ensure its accuracy.

You can view exactly what is being collected by setting the following environment variable: `VERCEL_TELEMETRY_DEBUG=1`.

When this environment variable is set, data will not be sent to Vercel. The data will only be printed out to the [_stderr_ stream](https://en.wikipedia.org/wiki/Standard_streams), prefixed with `[telemetry]`.

An example telemetry event looks like this:

```
{
  "id": "cf9022fd-e4b3-4f67-bda2-f02dba5b2e40",
  "eventTime": 1728421688109,
  "key": "subcommand:ls",
  "value": "ls",
  "teamId": "team_9Cdf9AE0j9ef09FaSdEU0f0s",
  "sessionId": "e29b9b32-3edd-4599-92d2-f6886af005f6"
}
```

## [What about sensitive data?](#what-about-sensitive-data)

Vercel CLI Telemetry does not collect any metrics which may contain sensitive data, including, but not limited to: environment variables, file paths, contents of files, logs, or serialized JavaScript errors.

For more information about Vercel's privacy practices, please see our [Privacy Notice](https://vercel.com/legal/privacy-policy) and if you have any questions, feel free to reach out to [privacy@vercel.com](mailto:privacy@vercel.com).

## [How do I opt-out of Vercel CLI telemetry?](#how-do-i-opt-out-of-vercel-cli-telemetry)

You may use the [vercel telemetry](/docs/cli/telemetry) command to manage the telemetry collection status. This sets a global configuration value on your computer.

You may opt-out of telemetry data collection by running `vercel telemetry disable`:

terminal

```
vercel telemetry disable
```

You may check the status of telemetry collection at any time by running `vercel telemetry status`:

terminal

```
vercel telemetry status
```

You may re-enable telemetry if you'd like to re-join the program by running the following:

terminal

```
vercel telemetry enable
```

Alternatively, you may opt-out by setting an environment variable: `VERCEL_TELEMETRY_DISABLED=1`. This will only apply for runs where the environment variable is set and will not change your configured telemetry status.

# Vercel CLI Global Options

Copy page

Ask AI about this page

Last updated March 5, 2025

Global options are commonly available to use with multiple Vercel CLI commands.

## [Current Working Directory](#current-working-directory)

The `--cwd` option can be used to provide a working directory (that can be different from the current directory) when running Vercel CLI commands.

This option can be a relative or absolute path.

terminal

```
vercel --cwd ~/path-to/project
```

Using the `vercel` command with the `--cwd` option.

## [Debug](#debug)

The `--debug` option, shorthand `-d`, can be used to provide a more verbose output when running Vercel CLI commands.

terminal

```
vercel --debug
```

Using the `vercel` command with the `--debug` option.

## [Global config](#global-config)

The `--global-config` option, shorthand `-Q`, can be used set the path to the [global configuration directory](/docs/project-configuration/global-configuration).

terminal

```
vercel --global-config /path-to/global-config-directory
```

Using the `vercel` command with the `--global-config` option.

## [Help](#help)

The `--help` option, shorthand `-h`, can be used to display more information about [Vercel CLI](/cli) commands.

terminal

```
vercel --help
```

Using the `vercel` command with the `--help` option.

terminal

```
vercel alias --help
```

Using the `vercel alias` command with the `--help` option.

## [Local config](#local-config)

The `--local-config` option, shorthand `-A`, can be used to set the path to a local `vercel.json` file.

terminal

```
vercel --local-config /path-to/vercel.json
```

Using the `vercel` command with the `--local-config` option.

## [Scope](#scope)

The `--scope` option, shorthand `-S`, can be used to execute Vercel CLI commands from a scope that’s not currently active.

terminal

```
vercel --scope my-team-slug
```

Using the `vercel` command with the `--scope` option.

## [Token](#token)

The `--token` option, shorthand `-t`, can be used to execute Vercel CLI commands with an [authorization token](/account/tokens).

terminal

```
vercel --token iZJb2oftmY4ab12HBzyBXMkp
```

Using the `vercel` command with the `--token` option.

## [No Color](#no-color)

The `--no-color` option, or `NO_COLOR=1` environment variable, can be used to execute Vercel CLI commands with no color or emoji output. This respects the [NO\_COLOR standard](https://no-color.org).

terminal

```
vercel login --no-color
```

Using the `vercel` command with the `--no-color` option.

# vercel alias

Copy page

Ask AI about this page

Last updated March 17, 2025

The `vercel alias` command allows you to apply [custom domains](/docs/projects/custom-domains) to your deployments.

When a new deployment is created (with our [Git Integration](/docs/git), Vercel CLI, or the [REST API](/docs/rest-api)), the platform will automatically apply any [custom domains](/docs/projects/custom-domains) configured in the project settings.

Any custom domain that doesn't have a [custom preview branch](/docs/domains/working-with-domains/assign-domain-to-a-git-branch) configured (there can only be one Production Branch and it's [configured separately](/docs/git#production-branch) in the project settings) will be applied to production deployments created through any of the available sources.

Custom domains that do have a custom preview branch configured, however, only get applied when using the [Git Integration](/docs/git).

If you're not using the [Git Integration](/docs/git), `vercel alias` is a great solution if you still need to apply custom domains based on Git branches, or other heuristics.

## [Preferred production commands](#preferred-production-commands)

The `vercel alias` command is not the recommended way to promote production deployments to specific domains. Instead, you can use the following commands:

*   [`vercel --prod --skip-domain`](/docs/cli/deploy#prod): Use to skip custom domain assignment when deploying to production and creating a staged deployment
*   [`vercel promote [deployment-id or url]`](/docs/cli/promote): Use to promote your staged deployment to your custom domains
*   [`vercel rollback [deployment-id or url]`](/docs/cli/rollback): Use to alias an earlier production deployment to your custom domains

## [Usage](#usage)

In general, the command allows for assigning custom domains to any deployment.

Make sure to not include the HTTP protocol (e.g. `https://`) for the `[custom-domain]` parameter.

terminal

```
vercel alias set [deployment-url] [custom-domain]
```

Using the `vercel alias` command to assign a custom domain to a deployment.

terminal

```
vercel alias rm [custom-domain]
```

Using the `vercel alias` command to remove a custom domain from a deployment.

terminal

```
vercel alias ls
```

Using the `vercel alias` command to list custom domains that were assigned to deployments.

## [Unique options](#unique-options)

These are options that only apply to the `vercel alias` command.

### [Yes](#yes)

The `--yes` option can be used to bypass the confirmation prompt when removing an alias.

terminal

```
vercel alias rm [custom-domain] --yes
```

Using the `vercel alias rm` command with the `--yes` option.

### [Limit](#limit)

The `--limit` option can be used to specify the maximum number of aliases returned when using `ls`. The default value is `20` and the maximum is `100`.

terminal

```
vercel alias ls --limit 100
```

Using the `vercel alias ls` command with the `--limit` option.

## [Global Options](#global-options)

The following [global options](/docs/cli/global-options) can be passed when using the `vercel alias` command:

*   [`--cwd`](/docs/cli/global-options#current-working-directory)
*   [`--debug`](/docs/cli/global-options#debug)
*   [`--global-config`](/docs/cli/global-options#global-config)
*   [`--help`](/docs/cli/global-options#help)
*   [`--local-config`](/docs/cli/global-options#local-config)
*   [`--no-color`](/docs/cli/global-options#no-color)
*   [`--scope`](/docs/cli/global-options#scope)
*   [`--token`](/docs/cli/global-options#token)

For more information on global options and their usage, refer to the [options section](/docs/cli/global-options).

## [Related guides](#related-guides)

*   [How do I resolve alias related errors on Vercel?](/guides/how-to-resolve-alias-errors-on-vercel)

