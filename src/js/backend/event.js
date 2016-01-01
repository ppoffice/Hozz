const events = new Map();

export default {
    on (event, listener) {
        if (!events.has(event)) {
            events.set(event, new Set());
        }
        const listeners = events.get(event);
        listeners.add(listener);
    },

    off (event, listener) {
        if (events.has(event)) {
            const listeners = events.get(event);
            listeners.delete(listener);
        }
    },

    emit (event, data) {
        if (events.has(event)) {
            const listeners = events.get(event);
            for (let listener of listeners) {
                listener.call(null, data);
            }
        }
    }
}