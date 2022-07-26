const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, {
          // Translate CSS into CommonJS modules
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              outputStyle: "compressed",
            }
          }
        }],
      }, {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
        type: 'asset/resource',
        generator: {
          //filename: 'fonts/[name]-[hash][ext][query]'
          filename: 'fonts/[name][ext][query]'
        }
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: "css/[name].css" })],
};
