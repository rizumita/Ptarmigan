const path = require('path');

module.exports = {
    // 開発用の設定
    mode: 'development',

    // エントリポイントとなるコード
    entry: './src/index.ts',

    // バンドル後の js ファイルの出力先
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },

    // ソースマップファイルの出力設定
    devtool: 'source-map',

    module: {
        rules: [
            // TypeScript ファイルの処理方法
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        // 拡張子を配列で指定
        extensions: [
            '.ts', '.js',
        ],
    },

    target:'node'
};
