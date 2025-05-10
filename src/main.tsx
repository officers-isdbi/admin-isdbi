import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import Fallback from './components/Fallback';

import WebApp from './WebApp.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Suspense
			fallback={<Fallback key={'OI_APP_LOADING'} />}
			key={'OI_APP_LOADING'}
		>
			<WebApp />
		</Suspense>
	</React.StrictMode>
);
