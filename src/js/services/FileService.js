const fs = require('fs');
const FileService = {};

/**
 * Wrap a Node.js fs methods with Promise
 * @param  {String} method Function name
 * @return {Promise}       Wrapped function
 */
const promisefy = (method) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fs[method](...args, (...__args) => {
                const error = __args.splice(0, 1)[0];
                if (error) {
                    reject(error);
                } else {
                    resolve(...__args);
                }
            });
        });
    }
}

/**
 * Convert some common fs methods to Promises
 */
['readFile', 'writeFile', 'appendFile', 'unlink'].forEach((method) => {
    FileService[method] = promisefy(method);
});

export default FileService;
