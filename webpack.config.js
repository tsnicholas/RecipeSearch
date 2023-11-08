const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/recipeSearch.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'css-loader',
                    'style-loader'
                ]
            },
        ],
    },
    devServer: {
        port: 9000,
    },
    resolve: {
        fallback: {
            "location": false,
            "navigator": false,
            "xmlhttprequest": false,
            "jsdom": false,
        }
    }
}
