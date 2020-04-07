process.traceDeprecation = true;

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackIncludeSiblingChunksPlugin = require("html-webpack-include-sibling-chunks-plugin");
const path = require("path");
const devMode = process.env.NODE_ENV !== 'production';
let plugins = [
    new CopyWebpackPlugin([
        {
            from:
                "node_modules/material-components-web/dist/material-components-web.min.css",
            to: "app/lib/materialdesign/material-components-web.min.css"
        },
        {
            from: "node_modules/react/umd/react.development.js",
            to: "app/lib/react/react.js"
        },
        {
            from: "node_modules/react-dom/umd/react-dom.development.js",
            to: "app/lib/react/react-dom.js"
        },
        {
            from: "src/app/components/style/mdcRoot.css",
            to: "app/lib/style/mdcRoot.css"
        },
        {
            from: "src/external/dvelop-dapi/scripts/dapi.js",
            to: "app/lib/dapi/dapi.js"
        },
        {
            from: "src/external/detailTabJSLib.js",
            to: "app/lib/cm/detailTabJSLib.js"
        },
        {
            from: "src/app/i18n/",
            to: "app/i18n/"
        }
    ])
];

const entry = {
    serviceContract: "./src/app/serviceContract/main.jsx",
};
let htmlwebpacklist = [];
Object.keys(entry).map(appName => {
    htmlwebpacklist.push(
        new HtmlWebpackPlugin({
            title: "Title",
            filename: "app/" + appName + "/index.html",
            template: "src/index.html",
            chunks: [appName]
        })
    );
    //Add polyfills to support IE11
    entry[appName] = ["@babel/polyfill", "whatwg-fetch", "custom-event-polyfill", entry[appName]];
});
plugins.push(new HtmlWebpackIncludeSiblingChunksPlugin(), ...htmlwebpacklist);
plugins.push(new MiniCssExtractPlugin({
    filename: "app/[name].[hash].css",
}));
const settings = {
    entry: entry,

    output: {
        filename: "app/[name]/[name].[hash].js",
        publicPath: "/detailTabExample/",
        path: path.join(__dirname, "/src/dist/"),
        chunkFilename: "app/[name].[contenthash:8].chunk.js"
    },
    resolve: {
        alias: {
            "@material/base/index": path.resolve(
                __dirname,
                "node_modules/@material/base/dist/mdc.base.min.js"
            )
        },
        extensions: [
            ".webpack.js",
            "web.js",
            ".js",
            ".jsx",
            ".css",
            ".scss",
            ".sass"
        ]
    },

    module: {
        rules: [
            {
                test: /\.(|woff|woff2)$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(jpe|jpeg|png|gif|svg|eot|ttf)$/,
                loader: "file-loader",
                options: {
                    name: "app/customIcons/[name].[hash].[ext]",
                    publicPath: '../../'
                }
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: [/node_modules/],
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.css$/,
                include: [/node_modules/],
                use: [
                    "style-loader",
                    'postcss-loader'
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    name: "commons",
                    minChunks: 2,
                    maxInitialRequests: 5
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: plugins
};

module.exports = settings;
