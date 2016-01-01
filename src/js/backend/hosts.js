const path = require('path');
import UID from 'uid';

import io from './io';
import log from './log';
import { HOSTS_COUNT_MATHER,
         TOTAL_HOSTS_UID,
         WORKSPACE } from '../constants';

const countRules = (text) => {
    let ret = null;
    let count = 0;
    while ((ret = HOSTS_COUNT_MATHER.exec(text)) !== null) {
        count++;
    }
    return count;
}

class Hosts {
    constructor (options) {
        const { index, uid, name, online, url, count, text } = options;
        this.index = index || 0;
        this.uid = uid || UID(16);
        this.name = name || '';
        this.online = online || false;
        this.url = url || '';
        this.count = count || 0;
        if (uid === TOTAL_HOSTS_UID) {
            this.text = text;
        } else {
            this.setText(text || '');
        }
        this.isSyncing = false;
    }

    toObject () {
        return {
            uid:    this.uid,
            url:    this.url,
            name:   this.name,
            text:   this.text,
            index:  this.index,
            online: this.online,
            count:  this.count,
        };
    }

    setText (text) {
        this.text = text;
        this.count = countRules(text);
    }

    toggleStatus () {
        this.online = !this.online;
    }

    stashStatus () {
        if (typeof(this.__online) === 'undefined') {
            this.__online = this.online;
            this.online = false;
        }
    }

    popStatus () {
        if (typeof(this.__online) !== 'undefined') {
            this.online = this.__online;
            delete this.__online;
        }
    }

    save () {
        if (!this.uid || this.uid === TOTAL_HOSTS_UID) {
            return Promise.resolve();
        }
        return io.writeFile(path.join(WORKSPACE, this.uid), this.text);
    }

    remove () {
        if (!this.uid || this.uid === TOTAL_HOSTS_UID) {
            return Promise.resolve();
        }
        return io.unlink(path.join(WORKSPACE, this.uid));
    }

    load () {
        if (this.uid && this.uid !== TOTAL_HOSTS_UID) {
            return io.readFile(path.join(WORKSPACE, this.uid), 'utf-8').then((text) => {
                this.setText(text);
                return Promise.resolve();
            }).catch(log);
        } else {
            return Promise.resolve();
        }
    }

    updateFromUrl () {
        if (this.url) {
            this.isSyncing = true;
            return io.requestUrl(this.url).then((text) => {
                this.setText(text);
                this.isSyncing = false;
                return this.save();
            }).catch((error) => {
                log(error);
                this.isSyncing = false;
                return Promise.resolve();
            });
        } else {
            return Promise.resolve();
        }
    }
}

Hosts.createFromText = (text) => {
    return new Hosts({
        name: 'New Hosts',
        online: false,
        url: '',
        text,
    });
}

export default Hosts;