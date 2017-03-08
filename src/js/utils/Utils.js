export function checkListener (func) {
    if (!func) {
        return () => {
            console.warn(new Error('Listener not implemented!'));
        };
    }
    return func;
}

export function noop() {

}