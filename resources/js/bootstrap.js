import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
//
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Pusher = Pusher;

console.log(import.meta.env.VITE_APP_URL);

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: "mt1",
    forceTLS: true,
});
