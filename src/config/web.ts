// API configuration
export const API_ROUTE = new URL(
	import.meta.env.OI_APP_API_ROUTE || '/api/v1',
	import.meta.env.OI_APP_API_URL || 'http://localhost:49544'
).href;

// languages configuration
export const CHANGE_DIRECTION =
	import.meta.env.OI_APP_CHANGE_DIRECTION || false;
// if not get browser default language
/* export const DEFAULT_LANGUAGE = (import.meta.env.OI_APP_DEFAULT_LANGUAGE?.toLocaleLowerCase() ||
	window.navigator.language?.split('-')[0].toLocaleLowerCase() ||
	'fr') as LanguagesI;
 */
// DEBUG
//export const CLIENT_DEBUG = "[Client]";

// DEV
export const DEV = import.meta.env.OI_APP_DEV || false;
export const DISABLE_AUTH = import.meta.env.OI_APP_DISABLE_AUTH || false;
export const localStorageWebSiteID = {
	current: 'OI_WEBSITES_CURRENT',
	currentID: 'OI_WEBSITES_CURRENT_ID',
	websites: 'OI_WEBSITES',
};
export const localStorageUserID = 'OI_USER';
/* export const languages: LanguagesI[] = ['en', 'fr', 'ar'];
 */
