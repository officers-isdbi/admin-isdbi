import { atom, useAtom, useSetAtom } from 'jotai';
interface AuthUser {
	user: UserI | null;
	isAdmin: boolean;
}
// Define the user atom
const userAtom = atom<AuthUser>({
	user: null,
	isAdmin: false,
});

// Hook to get and set the user atom
export function useUser() {
	const [{ user, isAdmin }, setUserAtom] = useAtom(userAtom);
	return {
		user,
		isAdmin,
		isLoggedIn: !!user,
		logout: () => {
			setUserAtom((prev) => ({
				...prev,
				user: null,
				isAdmin: false,
			}));
		},
	};
}

// Hook to set the user atom only
export function useSetUser() {
	const setUserAtom = useSetAtom(userAtom);
	return {
		setUser: (user: UserI | null) => {
			setUserAtom((prev) => ({
				...prev,
				user,
				isAdmin: user ? user.isAdmin : false,
			}));
		},
		removeUser: () => {
			setUserAtom((prev) => ({
				...prev,
				user: null,
				isAdmin: false,
			}));
		},
	};
}
