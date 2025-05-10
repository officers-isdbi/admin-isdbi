import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getUserData } from '$client/endpoints/auth';
import { useSetUser } from '@/hooks/useUser';

export default function CheckAuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { setUser, removeUser } = useSetUser();
	const location = useLocation();
	const alreadyConnected = !!localStorage.getItem('User');
	const GetUserData = useCallback(
		() =>
			getUserData()
				.then((response) => {
					if (!response.success) throw new Error(response.message);
					const auth = response.data;
					const { user } = auth;
					setUser(user);

					if (
						['/app'].some((loc) =>
							location.pathname.startsWith(loc)
						)
					)
						toast.success('welcome back.');
					return response;
				})
				.catch(() => {
					if (alreadyConnected) toast.error('You are not logged in');
					removeUser();
					return null;
				}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[alreadyConnected, location.pathname]
	);

	useSuspenseQuery({
		queryKey: ['user'],
		refetchOnMount: false,
		queryFn: GetUserData,
	});
	return children;
}
