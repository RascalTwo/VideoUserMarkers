import React from 'react';

export default function Sorting({ values, fields, query }) {
	return (
		<details className="absolute z-20 self-start group">
			<summary className="inline-block p-1 list-none cursor-pointer bg-slate-50 dark:bg-slate-900 w-max rounded-br-md group-open:rounded-br-none">
				<i className="fa fa-random" alt="Sorting" title="Sorting"></i>
			</summary>

			<form className="flex flex-col w-56 p-6 ml-4 shadow-lg dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900 md:w-64 rounded-tr-md rounded-br-md rounded-bl-md">
				{Object.entries(values || {}).map(([key, value]) => (
					<input key={key} type="hidden" name={key} value={value} />
				))}
				<div className="flex justify-between">
					<label htmlFor="sort">
						<span className="text-xs font-semibold">Sort by</span>
					</label>
					<select
						id="sort"
						name="sort"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/2"
					>
						{Object.entries(fields).map(([value, text]) => (
							<option
								key={value}
								value={value}
								{...(query.sort === value ? { selected: true } : {})}
							>
								{text}
							</option>
						))}
					</select>
				</div>
				<div className="flex justify-between mt-3">
					<label htmlFor="descending">
						<span className="text-xs font-semibold">Direction</span>
					</label>
					<label className="relative flex items-center cursor-pointer select-none w-max">
						<input
							type="checkbox"
							id="descending"
							{...(query.descending ? { defaultChecked: true } : {})}
							name="descending"
							className="transition-colors bg-[#0000ff] rounded-full appearance-none cursor-pointer w-28 toggle-checkbox-wide checked:bg-red-500 h-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
						/>
						<span className="absolute text-xs font-medium text-white uppercase right-1">
							{' '}
							Ascend{' '}
						</span>
						<span className="absolute text-xs font-medium text-white uppercase right-14">
							{' '}
							Descend{' '}
						</span>
						<span className="absolute transition-transform transform bg-gray-200 rounded-full dark:bg-gray-700 w-14 h-7 right-14"></span>
					</label>
				</div>
				<div>
					<button
						type="submit"
						className="flex items-center justify-center w-full h-12 px-6 mt-3 text-sm font-semibold text-center text-white bg-[#9146FF] rounded hover:bg-[#9106FF]"
					>
						Resort
					</button>
				</div>
			</form>
		</details>
	);
}
