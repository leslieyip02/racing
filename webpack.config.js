const path = require("path");

module.exports = {
    mode: "none",
    entry: "./src/index.ts",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
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

// checks before deploying:
// ☐ npm run build
// ☐ copy assets and css folders into dist
// ☐ copy index.html into dist and change path for main.js to "./main.js"
// ☐ npm run deploy
