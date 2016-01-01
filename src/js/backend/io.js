const fs = require('fs');
import fetch from 'node-fetch';

const io = {};

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
const fsMethods = ['readFile', 'writeFile', 'appendFile', 'unlink'].forEach((method) => {
    io[method] = promisefy(method);
});

const readDropFiles = (files) => {
    return files.map((file) => {
        if (!file.type.match('text.*')) {
            return Promise.resolve(null);
        }
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                resolve({
                    name: file.name,
                    text: e.target.result
                });
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsText(file);
        });
    });
}

const requestUrl = (url) => {
    return fetch(url).then((response) => {
        return Promise.resolve(response.text());
    });
}

const downloadUrl = (url) => {
    return fetch(url).then((response) => {
        return new Promise((resolve, reject) => {
            const bufs = [];
            const readable = response.body;
            readable.on('data', (b) => {
                bufs.push(b);
            });
            readable.on('end', () => {
                resolve(Buffer.concat(bufs));
            });
            readable.on('error', (e) => {
                reject(e);
            });
        });
    });
}

export default Object.assign(io, {
    requestUrl,
    downloadUrl,
    readDropFiles,
});