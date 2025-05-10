import { Route, Navigate, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import DashboardAdmin from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import { useUser } from './hooks/useUser';

// PrivateRoute component
function PrivateRoute({ children }: { children: React.ReactNode }) {
	const { isLoggedIn } = useUser();
	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}
	return <>{children}</>;
}

export default function Router() {
	const { isLoggedIn, user } = useUser();

	return (
		<Routes>
			<Route
				path="/login"
				element={
					isLoggedIn ? (
						<Navigate to={`/${user?._id}/dashboard/`} replace />
					) : (
						<LoginPage />
					)
				}
			/>
			{/* 	<Route
				path="/register"
				element={
					isLoggedIn ? (
						<Navigate to={`/${user?._id}/dashboard/`} replace />
					) : (
						<RegisterPage />
					)
				}
			/> */}
			<Route
				path="/:userId/dashboard/"
				element={
					<PrivateRoute>
						{/* <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome, Admin</p>
              <Button variant="default">Default Button</Button>
            </div> */}
						<DashboardAdmin />
					</PrivateRoute>
				}
			/>
			<Route
				path="/chat/:id"
				element={
					<PrivateRoute>
						<ChatPage />
					</PrivateRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}
