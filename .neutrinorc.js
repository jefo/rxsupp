const webpack = require('webpack');

module.exports = (neutrino) => {
    // Create named plugins too!
    console.log('webpack.ProvidePlugin', webpack.ProvidePlugin)
    neutrino.config
        .plugin('provide1')
        .use(webpack.ProvidePlugin, [{
            Buffer: ['buffer', 'Buffer']
        }]);
};
