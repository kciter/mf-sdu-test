const webpack = require('webpack');
const packageJsonDeps = require('./package.json').dependencies;

module.exports = {
  future: {
    webpack5: true,
  },
  pageExtensions: ['page.tsx', 'page.ts'],
  webpack(config, options) {
    config.experiments = { topLevelAwait: true };
    config.output.publicPath = 'auto';

    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    config.plugins.push(
      new webpack.container.ModuleFederationPlugin({
        name: 'mf-example',
        shared: [
          { react: { requiredVersion: packageJsonDeps['react'], singleton: true, eager: true } },
          { 'react-dom': { requiredVersion: packageJsonDeps['react-dom'], singleton: true, eager: true } },
        ],
      }),
    );

    return config;
  },
};
