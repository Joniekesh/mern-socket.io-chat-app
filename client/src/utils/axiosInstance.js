import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://chatapp-mfdp.onrender.com",
});

export default axiosInstance;
