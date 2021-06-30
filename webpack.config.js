const path = require('path');

module.exports = {
    entry: path.join(__dirname, './src/ruby-pipeline-script-v1.js'),
    mode: 'production',
    output: {
        filename: 'ruby-pipeline.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};
