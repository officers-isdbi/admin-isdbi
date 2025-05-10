import axios from 'axios';

import axiosConfig from '..';

export const uploadImage = async (file: File): Promise<ResponseI<MyImageFile>> => {
	const formData = new FormData();
	formData.append('image', file); // 'image' is the field name expected by the backend

	try {
		const response = await axiosConfig.post<ResponseI<MyImageFile>>(
			'/upload/image', // Replace with your backend endpoint
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data;
	} catch (error: unknown) {
		// Check if the error is an AxiosError
		if (axios.isAxiosError(error)) {
			// If there's a response from the server, use its message
			throw new Error(error.response?.data?.message || 'Failed to upload image');
		}
		// For other types of errors, use a generic message
		throw new Error('An unexpected error occurred');
	}
};
export const uploadFile = async (file: File): Promise<ResponseI<MyImageFile>> => {
	const formData = new FormData();
	const fieldName = file.type.startsWith('image/') ? 'image' : 'file';
	formData.append(fieldName, file); // Dynamically decide the field name based on MIME type

	try {
		const endpoint = `/upload/${fieldName}`; // Dynamic endpoint based on detected type
		const response = await axiosConfig.post<ResponseI<MyImageFile>>(endpoint, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error: unknown) {
		// Check if the error is an AxiosError
		if (axios.isAxiosError(error)) {
			// If there's a response from the server, use its message
			throw new Error(error.response?.data?.message || `Failed to upload ${fieldName}`);
		}
		// For other types of errors, use a generic message
		throw new Error('An unexpected error occurred');
	}
};
