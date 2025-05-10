import { type FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

export default function ErrorFallback({
	error,
	resetErrorBoundary,
}: FallbackProps) {
	const navigate = useNavigate();
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex max-w-md flex-col items-center justify-center gap-10 py-4 text-center">
				{/* <Logo className="max-h-48 w-[90vw] max-w-md" /> */}
				<h1 className="text-8xl font-bold text-red-800 uppercase">
					Unexpected Error
				</h1>
				<h2 className="text-3xl font-bold">something went wrong</h2>
				<p>
					{error && error instanceof Error
						? error.message
						: 'Unknown error'}
				</p>
				<div className="flex items-center justify-center gap-4">
					<Button
						onClick={() => {
							resetErrorBoundary();
							navigate(-1);
						}}
						variant="outline"
					>
						<span className="icon-[mdi--home] h-5 w-5" />
						Back
					</Button>
					<Button
						variant="ghost"
						onClick={() => window.location.reload()}
					>
						<span className="icon-[mdi--refresh] h-5 w-5" />
						Reload
					</Button>
				</div>
			</div>
		</div>
	);
}
