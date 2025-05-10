import './container.css';
import SwirlingEffectSpinner from '../SwirlingEffectSpinner';

export default function Fallback() {
	return (
		<div className={'fb-container'}>
			<SwirlingEffectSpinner className="w-40 max-w-full" />
		</div>
	);
}
