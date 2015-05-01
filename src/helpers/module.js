/**
 * Return a module name given it's instance object
 * @param  {object} module module object
 * @return {String}        module name
 */
export function getModuleName(module) {
    return module.filename.split('/').slice(-2).join('/').split('.js')[0];
};