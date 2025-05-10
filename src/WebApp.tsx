import { lazy } from 'react';
const Providers = lazy(() => import('./WebApp.Providers'));
const Routes = lazy(() => import('./Routes'));

export default function WebApp() {
	return (
		<Providers>
			<main className="flex h-screen w-full flex-col overflow-auto">
				<div className="flex min-h-full w-full flex-col">
					<Routes />
				</div>
			</main>
		</Providers>
	);
}
