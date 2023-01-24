import React from 'react';

export default function CardContainer({ children }) {
	return (
		<div className="container px-4 mx-auto my-2 md:px-12">
			<div className="flex flex-wrap -mx-1 rounded-md shadow-md justify-evenly dark:shadow-slate-700 lg:-mx-4 bg-slate-300/75 dark:bg-slate-700/75">
				{children}
			</div>
		</div>
	);
}
