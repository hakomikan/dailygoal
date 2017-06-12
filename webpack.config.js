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
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['main'],
    })
  ]  
}
