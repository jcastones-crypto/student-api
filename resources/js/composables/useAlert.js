import { reactive } from 'vue';

// Shared state: every component that calls useAlert() sees the SAME object
const alert = reactive({ type: 'success', message: '' });
let timer = null;

export function useAlert() {
    function notify(type, message, duration = 5000) {
        alert.type = type;
        alert.message = message;
        clearTimeout(timer);
        if (duration > 0) {
            timer = setTimeout(() => {
                alert.message = '';
            }, duration);
        }
    }

    const success = (message) => notify('success', message);
    const error = (message) => notify('error', message, 8000);

    function clear() {
        clearTimeout(timer);
        alert.message = '';
    }

    return { alert, notify, success, error, clear };
}
