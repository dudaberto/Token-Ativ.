import axios from 'https://cdn.skypack.dev/axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        'Content-Type':'application/json'
    }
});

export default api;