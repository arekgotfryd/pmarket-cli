const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ShebangPlugin = require('webpack-shebang-plugin');

module.exports = {
  entry: "./src/main.ts",
  mode: "production",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true, // Preserve class names
          keep_fnames: true, // Preserve function names
        },
      }),
    ],
  },
  plugins: [new ShebangPlugin()]
};
