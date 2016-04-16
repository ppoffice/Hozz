import fetch from 'node-fetch';

/**
 * Request text content from a URL
 * @param  {String} url Content address
 * @return {Promise}    Promise for text processing
 */
const read = (url) => {
    return fetch(url).then((response) => {
        return Promise.resolve(response.text());
    });
}

/**
 * Download a file from a URL into a buffer
 * @param  {String} url Content address
 * @return {Promise}    Promise for buffer processing
 */
const download = (url) => {
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

export default {
    read, download
}
