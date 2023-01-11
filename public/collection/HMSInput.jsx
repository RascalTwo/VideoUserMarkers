const { useState, useMemo, useRef, useEffect } = React;

export default function HMSInput({ defaultValue = 0, onValueChange, ...props }) {
	const [value, setValue] = useState(defaultValue);
	const [caret, setCaret] = useState(0);
	const ref = useRef();
	useEffect(() => {
		ref.current.setSelectionRange(caret, caret);
	}, [caret]);
	const hmsValue = useMemo(() => {
		const hours = Math.floor(value / 3600);
		const minutes = Math.floor((value - hours * 3600) / 60);
		const seconds = value - hours * 3600 - minutes * 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}, [value]);
	return (
		<input
			className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
			type="text"
			ref={ref}
			value={hmsValue}
			onChange={e => {
				const [hours, minutes, seconds] = e.target.value.split(':');
				setCaret(e.target.selectionStart);
				const newValue = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0) * 1;
				setValue(newValue);
				onValueChange?.(newValue);
			}}
			{...props}
		/>
	);
}
