import CodeMirror from 'codemirror';
import { HOSTS_MATHER } from './constants';

CodeMirror.defineMode('hosts', function () {
    return {
        token: function (stream) {
            const c = stream.peek();
            let token_name;
            if (c === '#') {
                token_name = 'comment';
                stream.skipToEnd();
            } else if (!stream.string.match(HOSTS_MATHER)) {
                token_name = 'error';
                stream.skipToEnd();
            } else {
                if (!stream.skipTo('#')) {
                    token_name = stream.skipToEnd();
                }
            }
            return token_name;
        },
        lineComment: '#'
    };
});

export default {
    mode: 'hosts',
    lineNumbers: true,
};