export function checkListener (func) {
    if (!func) {
        return () => {
            console.log(new Error('Listener not implemented!'));
        };
    }
    return func;
}

export function noop() {

}