import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://jonie-chatapp.onrender.com/",
});

export default axiosInstance;
