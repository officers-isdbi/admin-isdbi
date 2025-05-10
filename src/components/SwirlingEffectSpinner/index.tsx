import './style.css';

const SwirlingEffectSpinner = ({
	className = 'h-14 w-14',
}: {
	className?: string;
}) => {
	return (
		<svg
			viewBox="0 0 800 800"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				className="spin2 stroke-primary"
				cx="400"
				cy="400"
				fill="none"
				r="200"
				strokeWidth="50"
				strokeDasharray="700 1400"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default SwirlingEffectSpinner;
