import React from 'react';

let tabsSeen = 0;

export default function TabbedContent({ tabs }) {
	const name = `css-tabs${tabsSeen++}`;
	return (
		<div className="w-10/12 m-auto border border-gray-100/25 tabbed bg-slate-200 dark:bg-slate-800/75">
			{tabs.map(([id]) => (
				<input key={id} type="radio" className="hidden" id={id} name={name} />
			))}

			<ul className="flex items-stretch justify-center p-0 list-none border-b-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 tabs">
				{tabs.map(([id, label]) => (
					<li key={id} className="group tab">
						<label
							className="block p-3 text-xs font-semibold text-gray-500 uppercase transition-all border border-gray-300 cursor-pointer bg-slate-100 group-hover:border-t-gray-700 group-hover:text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:group-hover:border-t-gray-300 dark:group-hover:text-gray-300"
							htmlFor={id}
						>
							{label}
						</label>
					</li>
				))}
			</ul>

			{tabs.map(([id, , content]) => (
				<div key={id} className="hidden p-5 tab-content">
					{content}
				</div>
			))}
		</div>
	);
}
