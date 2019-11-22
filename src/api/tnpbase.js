import axios from 'axios';

export default axios.create({
	baseURL: "http://10.10.0.20:5000/"
});
