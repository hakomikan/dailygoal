var webpack = require("webpack");

module.exports = {
  entry: {
    main: './apps/Client.tsx',
    common: [
      "react",
      "react-dom",
      "material-ui",
      "react-router",
      "axios",
      "material-ui/svg-icons"],
  },
  output: {
    filename: './dist/[name].js'
  },
  devtool: "source-map",
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ],
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  externals: {
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['main'],
    })
  ]  
}
