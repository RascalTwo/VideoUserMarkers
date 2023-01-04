const { useState, useEffect } = React;

export default function Modal({
	buttonContent,
	defaultOpen = false,
	onClose,
	children
}) {
	const [open, setOpen] = useState(defaultOpen);

	const close = () => {
		setOpen(false);
		onClose?.();
	}
	useEffect(() => {
		if (!open) return;

		const listener = e => {
			if (e.key === 'Escape') close();
		};

		return () => window.removeEventListener('keydown', listener);
	}, [open]);
	return (
		<>
			{buttonContent ? <button onClick={() => setOpen(true)}>{buttonContent}</button> : null}
			<div
				data-test-id="modal-backdrop"
				className={`${!open ? 'hidden' : ''
					} w-screen h-screen bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 flex items-center justify-center cursor-pointer z-20`}
				onClick={e => {
					if (e.target === e.currentTarget) close();
				}}
			>
				<div className="relative">
					<button className="absolute top-2 right-2" onClick={() => close()}><i className="fa fa-times-circle" alt="Close Modal" title="Close Modal"></i></button>
					{children}
				</div>
			</div>
		</>
	);
}
