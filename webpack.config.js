const path = require("path");

module.exports = {
  mode: "production",
  entry: ["./public/min.js/emojiscript.min.js"],
  output: {
    filename: "emojiscript.bundle.js",
    path: path.join(__dirname, "./public/min.js"),
  },
  devtool: "sourcemap",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
    ],
  },
};
