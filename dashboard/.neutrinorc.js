const path = require('path');
const react = require('neutrino-preset-react');
const jest = require('./jest');

module.exports = (neutrino) => {
  neutrino.use(react);
  neutrino.use(jest);
  neutrino.config.output.publicPath('/');
};
