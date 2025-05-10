import './index.css';

import { lazy, Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from '@/components/ui/sonner';

import { BrowserRouter } from 'react-router';
import {
	QueryClient,
	QueryClientProvider,
	QueryErrorResetBoundary,
} from '@tanstack/react-query';

import Fallback from './components/Fallback';
import ErrorFallback from './components/ErrorFallback';

const CheckAuthProvider = lazy(
	() => import('@client/providers/CheckAuthProvider')
);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});
export default function Providers({ children }: { children?: ReactNode }) {
	return (
		<>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<QueryErrorResetBoundary>
						{({ reset }) => (
							<ErrorBoundary
								FallbackComponent={ErrorFallback}
								onReset={reset}
							>
								<Suspense
									fallback={
										<Fallback key={'OI_APP_LOADING'} />
									}
									key={'OI_APP_LOADING'}
								>
									<CheckAuthProvider>
										{children}
									</CheckAuthProvider>
								</Suspense>
							</ErrorBoundary>
						)}
					</QueryErrorResetBoundary>
				</QueryClientProvider>
			</BrowserRouter>
			<Toaster />
		</>
	);
}
