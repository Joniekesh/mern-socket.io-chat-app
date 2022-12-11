import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://localhost:5000/api",
});

export default axiosInstance;
