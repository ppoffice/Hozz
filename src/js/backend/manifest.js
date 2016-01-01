const path = require('path');
const mkdirp = require('mkdirp');

import io from './io';
import log from './log';
import Hosts from './hosts';
import { MANIFEST,
         WORKSPACE,
         TOTAL_HOSTS_UID,
         NO_PERM_ERROR_TAG,
         NO_PERM_ERROR_TAG_WIN32 } from '../constants';

try {
    mkdirp.sync(WORKSPACE);
} catch (e) {
    log('Make workspace folder failed: ', e);
}

const sysHostsPath = () => {
    if (process.platform === 'win32') {
        return path.join(process.env.SYSTEMROOT, './system32/drivers/etc/hosts');
    } else {
        return '/etc/hosts';
    }
}

class Manifest {
    constructor (options) {
        const { online, hosts } = options;
        this.hosts = new Map();
        if (hosts instanceof Map) {
            this.hosts = hosts;
        } else if (Array.isArray(hosts)) {
            this.hosts = new Map();
            hosts.forEach((hostsObj) => {
                const __hosts = new Hosts(hostsObj);
                this.hosts.set(__hosts.uid, __hosts);
            });
        }
        this.online = typeof(online) === 'undefined' ? true : online;
    }

    getHostsByUid (uid) {
        return this.hosts.get(uid);
    }

    setHostsByUid (uid, hosts) {
        return this.hosts.set(uid, hosts);
    }

    getHostsList () {
        return Array.from(this.hosts.values()).sort((A, B) => {
            return (A.index | 0) - (B.index | 0);
        });
    }

    sortHosts () {
        this.getHostsList().forEach((hosts, index) => {
            hosts.index = index;
        });
    }

    addHosts (hosts) {
        this.sortHosts();
        hosts.index = this.getHostsList().length;
        this.hosts.set(hosts.uid, hosts);
        return this;
    }

    removeHosts (hosts) {
        this.hosts.delete(hosts.uid);
        this.sortHosts();
        return this;
    }

    moveHostsIndex (fromIndex, toIndex) {
        if (fromIndex === toIndex ||
            fromIndex < 0 ||
            toIndex > this.getHostsList().length) {
            return;
        }
        const list = this.getHostsList();
        list.splice(toIndex, 0, list.splice(fromIndex, 1)[0]);
        list.forEach((hosts, index) => {
            hosts.index = index;
        });
    }

    getMergedHosts () {
        let totalCount = 0;
        let totalHostsText = '';
        for (let hosts of this.getHostsList()) {
            if (!this.online) {
                hosts.stashStatus();
            } else {
                hosts.popStatus();
            }
            if (hosts.online) {
                totalHostsText += hosts.text + '\n';
                totalCount += hosts.count;
            }
        }
        return new Hosts({
            uid: TOTAL_HOSTS_UID,
            name: 'All',
            count: totalCount,
            text: totalHostsText,
            online: this.online,
        });
    }

    toSimpleObject () {
        const __manifest = Object.assign({}, this);
        const simpleHosts = this.getHostsList().map((hosts) => {
            const __hosts = hosts.toObject();
            delete __hosts.text;
            if (typeof(hosts.__online) !== 'undefined') {
                __hosts.online = hosts.__online;
            }
            return __hosts;
        });
        __manifest.hosts = simpleHosts;
        return __manifest;
    }

    commit () {
        return io.writeFile(MANIFEST, JSON.stringify(this.toSimpleObject()));
    }

    loadSysHosts () {
        return io.readFile(sysHostsPath(), 'utf-8').then((text) => {
            return Promise.resolve(Hosts.createFromText(text));
        }).catch((e) => {
            log(e);
            return Promise.resolve(null);
        });
    }

    saveSysHosts (hosts) {
        return io.writeFile(sysHostsPath(), this.online ? hosts.text : '').catch((error) => {
            if (error &&
                error.message &&
                (error.message.indexOf(NO_PERM_ERROR_TAG) > -1 ||
                 error.message.indexOf(NO_PERM_ERROR_TAG_WIN32) > -1)) {
                return Promise.reject(error);
            }
            log(error);
            return Promise.resolve();
        });
    }
}

Manifest.loadFromDisk = () => {
    return io.readFile(MANIFEST, 'utf-8').then((text) => {
        try {
            return Promise.resolve(JSON.parse(text));
        } catch (e) {
            return Promise.resolve({});
        }
    }).catch(() => {
        return Promise.resolve({});
    }).then((json) => {
        const { hosts } = json;
        const manifest = new Manifest(json);
        const hostsMap = new Map();
        if (Array.isArray(hosts)) {
            const hostsPromises = hosts.map((item) => {
                const __hosts = new Hosts(item);
                hostsMap.set(__hosts.uid, __hosts);
                return __hosts.load();
            });
            return Promise.all(hostsPromises).then(() => {
                manifest.hosts = hostsMap;
                return Promise.resolve(manifest);
            });
        } else {
            return manifest.loadSysHosts().then((hosts) => {
                hosts.online = true;
                hosts.name = 'Default Hosts';
                hosts.save();
                manifest.addHosts(hosts).commit();
                return Promise.resolve(manifest);
            });
        }
    });
}

export default Manifest;