import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://mern-socket-io-chatapp-client.onrender.com/api",
});

export default axiosInstance;
