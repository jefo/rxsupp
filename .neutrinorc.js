const webpack = require('webpack');

module.exports = (neutrino) => {
    neutrino.config
        .plugin('provide')
        .use(webpack.ProvidePlugin, [{
            Buffer: ['buffer', 'Buffer']
        }]);
};
