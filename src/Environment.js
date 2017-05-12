let pkg;
try{
  pkg = require('../../../package.json');
}catch(e){
  pkg = {};
}
const argument = require('argument');
const path = require('path');

class Environment {

  constructor () {

    console.log(`[PROCESS] ${JSON.stringify(process.env)}`);

    let env = argument(['ENVIRONMENT','NODE_ENV'], 'production');

    // Sometimes the argument is just passed as --production
    if (argument('PRODUCTION', null)) {
      env = 'production';
    }

    /**
     * If environment is in development
     * @type {boolean}
     */
    this.development = env === 'development' || env === 'dev';

    /**
     * Shortcut to development property.
     * @type {boolean}
     */
    this.dev = this.development;

    /**
     * If environment is in alpha
     * @type {boolean}
     */
    this.alpha = env === 'alpha';

    /**
     * If environment is in beta
     * @type {boolean}
     */
    this.beta = env === 'beta';

    /**
     * If environment is in gamma
     * @type {boolean}
     */
    this.gamma = env === 'gamma';

    /**
     * The environment name.
     */
    this.name = env;

    /**
     * Specifies the node modules path.
     */
    this.nodeModules = path.normalize(__dirname + '/../../');

    /**
     * If environment is in production
     * @type {boolean}
     */
    this.production =
      !this.development && !this.alpha && !this.beta && !this.gamma;

    /**
     * The application port.
     * @type {number}
     */
    this.port = argument('PORT', 9000);

  }

  /**
   * Sets an environment property.
   * @param {string} key The key to set.
   * @param {*} value The value of the environment.
   */
  set (key, value) {
    this[key] = value;
  }

  /**
   * Gets an environment property.
   * @param {string} key The key to get.
   * @param {*} defaultValue The default value to return if undefined.
   * @returns {*}
   */
  get (key, defaultValue) {
    return this[key] || defaultValue;
  }

  /**
   * Simple exposure of the argument.
   * @param {*} args The arguments to be passed.
   * @returns {*}
   */
  argument(...args){
    return argument.apply(this, args);
  }

  /**
   * Gets configuration from the package.json and overrides depending on
   * environment.
   * @example
   * {
   *  "prop": { "a":true },
   *  "development": { "prop":{ "a":false } }
   * }
   * environment.configuration('prop').a = false; // development
   * environment.configuration('prop').a = true; // every other environment
   *
   * @param scope
   * @returns {*|{}}
   */
  getConfiguration(scope){
    let config = pkg[scope] || pkg[`_${scope}`] || {};
    if(typeof config === 'object' && pkg[this.name]){
      config = Object.assign(config, pkg[this.name]);
    }
    return config;
  }

}

module.exports = Environment;
