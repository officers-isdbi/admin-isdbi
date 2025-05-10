import axios from 'axios';

import { API_ROUTE, localStorageWebSiteID } from '&client/web';

const axiosConfig = axios.create({
	baseURL: API_ROUTE,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

axiosConfig.interceptors.request.use(
	(config) => {
		config.headers['Accept-Language'] = localStorage.getItem('Language')?.toLocaleUpperCase() || 'en';
		const websiteId = localStorage.getItem(localStorageWebSiteID.currentID);
		if (websiteId) config.headers['Website-ID'] = websiteId;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosConfig;
