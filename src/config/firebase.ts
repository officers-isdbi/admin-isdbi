const firebaseConfig = {
	apiKey: import.meta.env.OI_APP_APP_FIREBASE_API_KEY,
	authDomain: import.meta.env.OI_APP_APP_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.OI_APP_APP_PROJECT_ID,
	storageBucket: import.meta.env.OI_APP_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.OI_APP_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.OI_APP_APP_FIREBASE_APP_ID,
	measurementId: import.meta.env.OI_APP_APP_FIREBASE_MEASUREMENT_ID,
};
export default firebaseConfig;
