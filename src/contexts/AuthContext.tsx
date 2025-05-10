// import { createContext, useContext, useEffect, useState } from "react";
// import type { ReactNode } from "react";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   password: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   register: (email: string, password: string, name: string) => Promise<void>;
//   checkUserExists: (email: string) => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Simuler la base de données d'utilisateurs
// const mockUsers: User[] = [
//   {
//     id: "1",
//     email: "test@example.com",
//     name: "Admin User",
//     password: "password123",
//   },
// ];

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   const checkUserExists = async (email: string): Promise<boolean> => {
//     // Simuler une vérification en base de données
//     return mockUsers.some((u) => u.email === email);
//   };

//   const register = async (email: string, password: string, name: string) => {
//     try {
//       const userExists = await checkUserExists(email);
//       if (userExists) {
//         throw new Error("Un utilisateur avec cet email existe déjà");
//       }

//       // Simuler la création d'un nouvel utilisateur
//       const newUser: User = {
//         id: (mockUsers.length + 1).toString(),
//         email,
//         name,
//         password,
//       };

//       mockUsers.push(newUser);
//       setUser(newUser);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       // // Hnaya n3eyet backend pour implémenter l'appel API pour l'authentification
//       // // Pour l'exemple, nous simulons une connexion réussie

//       // Vérifier si l'utilisateur existe
//       const userExists = await checkUserExists(email);
//       if (!userExists) {
//         throw new Error("Utilisateur non trouvé");
//       }

//       const user = mockUsers.find((u) => u.email === email);
//       if (user && user.password === password) {
//         const { password: _, ...userWithoutPassword } = user;
//         setUser(userWithoutPassword as User);
//       } else {
//         throw new Error("Mot de passe incorrect");
//       }

//       // Simuler une connexion réussie
//       const mockUser = mockUsers.find((u) => u.email === email);
//       if (mockUser) {
//         setUser(mockUser);
//       } else {
//         throw new Error("Identifiants incorrects");
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         isAuthenticated: !!user,
//         register,
//         checkUserExists,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error(
//       "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
//     );
//   }
//   return context;
// }

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
	id: string;
	email: string;
	name: string;
	password: string;
	role: 'admin' | 'manager' | 'user';
	department?: string;
	lastLogin?: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
	register: (email: string, password: string, name: string) => Promise<void>;
	checkUserExists: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simuler la base de données d'utilisateurs avec localStorage
const getStoredUsers = (): User[] => {
	const storedUsers = localStorage.getItem('users');
	if (storedUsers) {
		return JSON.parse(storedUsers);
	}
	// Utilisateurs par défaut si aucun n'est stocké
	const defaultUsers: User[] = [
		{
			id: '1',
			email: 'admin@isdbi.com',
			name: 'Admin Principal',
			password: 'Admin123',
			role: 'admin',
			department: 'Direction',
		},
	];
	localStorage.setItem('users', JSON.stringify(defaultUsers));
	return defaultUsers;
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>(getStoredUsers());

	// Mettre à jour localStorage quand les utilisateurs changent
	useEffect(() => {
		localStorage.setItem('users', JSON.stringify(users));
	}, [users]);

	const checkUserExists = async (email: string): Promise<boolean> => {
		return users.some((u) => u.email === email);
	};

	const register = async (email: string, password: string, name: string) => {
		const userExists = await checkUserExists(email);
		if (userExists) {
			throw new Error('Un utilisateur avec cet email existe déjà');
		}

		const newUser: User = {
			id: (users.length + 1).toString(),
			email,
			name,
			password,
			role: 'user',
			department: 'Non assigné',
			lastLogin: new Date().toISOString(),
		};

		// Mettre à jour l'état des utilisateurs
		setUsers((prevUsers) => [...prevUsers, newUser]);

		// Connecter automatiquement l'utilisateur après l'inscription
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...userWithoutPassword } = newUser;
		setUser(userWithoutPassword as User);
	};

	const login = async (email: string, password: string) => {
		// // Hnaya n3eyet backend pour implémenter l'appel API pour l'authentification
		//       // // Pour l'exemple, nous simulons une connexion réussie
		const userExists = await checkUserExists(email);
		if (!userExists) {
			throw new Error('Utilisateur non trouvé');
		}

		const foundUser = users.find((u) => u.email === email);
		if (foundUser && foundUser.password === password) {
			// Mettre à jour la dernière connexion
			const updatedUser = {
				...foundUser,
				lastLogin: new Date().toISOString(),
			};

			// Mettre à jour l'utilisateur dans la liste
			setUsers((prevUsers) =>
				prevUsers.map((u) => (u.id === foundUser.id ? updatedUser : u))
			);

			// Connecter l'utilisateur sans le mot de passe
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password: _, ...userWithoutPassword } = updatedUser;
			setUser(userWithoutPassword as User);
		} else {
			throw new Error('Mot de passe incorrect');
		}
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				isAuthenticated: !!user,
				register,
				checkUserExists,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
/* 
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error(
			"useAuth doit être utilisé à l'intérieur d'un AuthProvider"
		);
	}
	return context;
}
 */
