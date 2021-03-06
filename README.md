# scriptoni

A set of shared scripts for your front-end apps.

## Quick start

1. `npm i --save-dev scriptoni`
2. add any script you like to your package.json (e.g. `"metarpheus": "scriptoni metarpheus"`)
3. profit!

## Scripts

- [metarpheus](#metarpheus)
- [metarpheus-diff](#metarpheus-diff)
- [eslint & stylelint](#eslint-and-stylelint)
- [webpack](#webpack)

### `metarpheus`

Metarpheus generates tcomb-annotated JS models based on your Scala API. To use,
add this script to your `package.json`:

```js
"metarpheus": "scriptoni metarpheus"
```

By default, Metarpheus will look for your API at `../api/src/main/scala`, but
you can override this (and many other option) by creating a `metarpheus-config.js` file in
your project directory.
If this file is found, it will be merged with the
[default options](src/scripts/metarpheus/config.js). Only the options you specify will be overridden.


### `metarpheus-diff`

`metarpheus-diff` performs a diff between the existing generated models/api and the new ones. It can be used on a CI server to catch uncommitted updates to generated models and api.

Its configuration is identical to the one of the `metarpheus` script.


### `eslint and stylelint`

`eslint` and `stylelint` are used to enforce coding style to your js or sass files. Scriptoni provides a basic config for both of them, extending buildo's shared configs: [eslint-config](https://github.com/buildo/eslint-config) and [stylelint-config](https://github.com/buildo/stylelint-config/). To use these tools, add the following scripts to your `package.json`:

```json
"lint": "scriptoni lint",
"lint-style": "scriptoni lint-style"
```

and be sure your `.eslintrc` and `.stylelintrc` files in the root folder of your project contain the following:

- `.eslintrc`
```js
{
  "extends": "./node_modules/scriptoni/lib/scripts/eslint/eslintrc.json",
  // your custom rules here
  ...
}
```

- `.stylelintrc`
```js
{
  "extends": "./node_modules/scriptoni/lib/scripts/stylelint/stylelintrc.json"
  // your custom rules here
  ...
}
```

Scriptoni also provides autofixing capabilities adding the following scripts to your `package.json`:

```json
"lint-fix": "scriptoni lint --fix",
"lint-style-fix": "scriptoni stylefmt"
```

**Note**: you can pass any argument you would pass to `eslint`, `stylelint` or `stylefmt` executables. By default, `eslint` will lint your files under `src` directory, while `stylelint` and `stylefmt` will be called passing `src/**/*.scss`. You can override this default by passing diffent dirs as args, e.g.

```json
"lint": "scriptoni lint source/",
"lint-fix": "scriptoni lint-style source/**/*.css"
```

### `webpack`

Bundling your application with webpack is awesome. What's less awesome is having to configure it on every single project. `scriptoni` provides a default battle-tested webpack configuration for both development and production builds.

Add these scripts to your `package.json`:

```json
"start": "UV_THREADPOOL_SIZE=20 scriptoni web-dev -c ./config",
"build": "UV_THREADPOOL_SIZE=20 scriptoni web-build -c ./config"
```

where:

- the `UV_THREADPOOL_SIZE` trick is a workaround for a known issue with the sass-loader (https://github.com/webpack-contrib/sass-loader/issues/100). *You'll need this only if your project has more than a few `.sass` files*
- the `-c ./config` points to a directory containing configuration for your project (read more below).

**config dir (WIP)**

*This "API" is very work in progress at the moment*

The config dir for a project should include:
- a `Config.js` file. It should export a tcomb type validating the configuration. Currently only `port` is strictly required by scriptoni webpack to work
- any of `production.json`, `development.json`, `local.json` (all are optional): production and development should be tracked in version control, they are the default/base for `NODE_ENV=production` and `=development`, respectively. `local.json` is inteded to be used for custom, per-developer config tweaks, and should not be tracked.

The final config available to the source code is obtained merging `development.json` (`production.json` if `NODE_ENV=production`), `local.json` (which takes precedence) and (with maximum priority) environment variables corresponding to single config keys.

Environment variables follow this rule: to affect e.g. the `title: t.String` config key, you can provide the `CONFIG_TITLE=title` variable before building using `scriptoni web-dev` (or `web-build`).

The virtual 'config' module obtained is available as `import config from 'config'` anywhere in your code base.

Not every config keys is actually part of the final bundle, In other words, not every config key is visible to JS code when importing from 'config'. The bundled configs should be specified as part of a sub-key `bundle`:
```js
// config/Config.js
t.interface({
  port: t.Integer,
  bundle: t.interface({
    apiEndpoint: t.String
  }, { strict: true })
}, { strict: true })

// config/local.json
{
  "port": 8080 // non-bundled, this is available to webpack but not to JS code,
  "bundle": {
    "apiEndpoint": "example.com" // bundled, you can use `config.apiEndpoint` from JS code
  }
}
```

See https://github.com/buildo/webseed/tree/master/config for an example/minimal configuration.

**custom Webpack config**

The default webpack config shipped with scriptoni should be fine in most cases. However, you may need to change something.
If this is the case, you can override the default config by passing an additional `--webpackConfig` argument, followed by the file path containing your override function.

Let's say, for example, you want to change the output library.
You can provide a `webpack.config.js` file in the root directory of your project, with the following content:

```js
module.exports = (defaultConfig, { config, paths, NODE_ENV, target }) => ({
  ...defaultConfig,
  output: {
    ...config.output,
    library: 'myclient'
  }
});
```

As you can see, your function will receive the default webpack config as first argument, followed by an object containing useful options:
- `config`: the app config (see the previous chapter)
- `paths`: the paths used by your project
- `NODE_ENV`: 'development' or 'production'
- `target`: one of `dev`, `build`, `dev-ts` or `build-ts`

As a last step, you can change the `start` and `build` scripts in your `package.json` file by adding `--webpackConfig ./webpack.config.js` and the end of both commands:

```json
"start": "UV_THREADPOOL_SIZE=20 scriptoni web-dev -c ./config --webpackConfig ./webpack-config.js",
"build": "UV_THREADPOOL_SIZE=20 scriptoni web-build -c ./config --webpackConfig ./webpack-config.js"
```
