const path = require("path");

module.exports = {
    mode: "none",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    resolve: {
        alias: {
            three: path.resolve("./node_modules/three")
        },
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                exclude: /node_modules/,
            }
        ]
    }
};