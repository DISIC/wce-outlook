/* eslint-disable no-undef */
// Config webpack file

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let urlDev = "https://localhost:3000/";
let urlProd = "https://webconf.numerique.gouv.fr/wce-outlook/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  if (dev) {
    urlProd = urlDev;
  }
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      jquery: "./src/js/jquery-3.5.0.min.js",
      functions: "./src/js/functions.js",
    },
    output: {
      clean: true,
      filename: "[name].[contenthash].js",
    },
    resolve: {
      extensions: [".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
            {
              loader: "string-replace-loader",
              options: {
                search: urlDev,
                replace: urlProd,
                flags: "g",
              },
            },
          ],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "functions.html",
        template: "./src/functions.html",
        chunks: ["polyfill", "functions", "jquery"],
      }),
      new HtmlWebpackPlugin({
        filename: "template.html",
        template: "./src/template.html",
        chunks: ["polyfill"],
      }),
      new HtmlWebpackPlugin({
        filename: "AppointmentCreate.html",
        template: "./src/AppointmentCreate.html",
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
      client: {
        logging: "info",
      },
    },
  };

  return config;
};
