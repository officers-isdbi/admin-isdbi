import axiosConfig from '$client';

export async function logOut() {
	return (await axiosConfig.delete<ResponseI>('/auth')).data;
}
export async function getUserData() {
	return (await axiosConfig.get<ResponseI<UserAuthI>>('/auth')).data;
}
export async function loginUser(body: UserLogInI) {
	return (await axiosConfig.post<ResponseI<UserAuthI>>('/auth/login', body)).data;
}

export async function resendValidation(body: OTPSessionI) {
	return (await axiosConfig.post<ResponseI<string>>('/auth/validate', body)).data;
}
