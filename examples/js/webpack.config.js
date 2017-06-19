var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "src/index.jsx"),
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    devtool: "source-map",

    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".jsx", ".json", ".scss"]
    },

    devServer: {
        historyApiFallback: true,
        port: 5000,
        contentBase: path.join(__dirname, "build"),
    },

    module: {
        rules: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },

            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
    ]
};
