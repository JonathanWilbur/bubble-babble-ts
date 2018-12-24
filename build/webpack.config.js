const path = require('path');
module.exports = {
    entry: [
        "./source/bubblebabble.ts"
    ],
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "bubblebabble.min.js",
        library: "bubblebabble",
        libraryTarget: "var"
    },
    resolve: {
        extensions: [ ".ts" ]
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true
    },
    target: "web"
};