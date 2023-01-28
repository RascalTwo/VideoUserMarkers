import React from 'react';
import withLayout from '../layouts';

function New({ query }) {
	return (
		<form
			className="flex flex-col p-6 mt-6 rounded shadow-lg bg-slate-50 dark:bg-slate-900"
			method="POST"
		>
			<label className="text-xs font-semibold" htmlFor="entity">
				Video ID/URL
			</label>
			<input
				className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
				type="text"
				name="entity"
				id="entity"
				value={query.entity}
			/>
			<div className="flex justify-between mt-3">
				<label htmlFor="public">
					<span className="text-xs font-semibold">Public</span>
				</label>
				<label className="relative flex items-center cursor-pointer select-none w-max">
					<input
						type="checkbox"
						id="public"
						{...(!query.public || query.public === 'true' ? { defaultChecked: true } : {})}
						name="public"
						className="transition-colors bg-red-500 rounded-full appearance-none cursor-pointer toggle-checkbox checked:bg-green-500 w-14 h-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
					/>
					<span className="absolute text-xs font-medium text-white uppercase right-1"> No </span>
					<span className="absolute text-xs font-medium text-white uppercase right-8"> Yes </span>
					<span className="absolute transition-transform transform bg-gray-200 rounded-full dark:bg-gray-700 w-7 h-7 right-7"></span>
				</label>
			</div>
			<div className="flex justify-between mt-3">
				<label htmlFor="usingYoutube">
					<span className="text-xs font-semibold">Platform</span>
				</label>
				<label className="relative flex items-center cursor-pointer select-none w-max">
					<input
						type="checkbox"
						id="usingYoutube"
						{...(query.usingYoutube === 'true'
							? { defaultChecked: true }
							: query.entity && query.entity.length === 10
								? {}
								: { defaultChecked: true })}
						name="usingYoutube"
						className="transition-colors bg-[#9146FF] rounded-full appearance-none cursor-pointer w-28 toggle-checkbox-wide checked:bg-red-500 h-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
					/>
					<span className="absolute text-xs font-medium text-white uppercase right-1">
						{' '}
						Twitch{' '}
					</span>
					<span className="absolute text-xs font-medium text-white uppercase right-14">
						{' '}
						YouTube{' '}
					</span>
					<span className="absolute transition-transform transform bg-gray-200 rounded-full dark:bg-gray-700 w-14 h-7 right-14"></span>
				</label>
			</div>
			<div className="flex justify-between mt-3">
				<label htmlFor="attemptImport">
					<span className="text-xs font-semibold">Attempt Import</span>
				</label>
				<label className="relative flex items-center cursor-pointer select-none w-max">
					<input
						type="checkbox"
						id="attemptImport"
						{...(!query.attemptImport || query.attemptImport === 'true'
							? { defaultChecked: true }
							: {})}
						name="attemptImport"
						className="transition-colors bg-red-500 rounded-full appearance-none cursor-pointer toggle-checkbox checked:bg-green-500 w-14 h-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
					/>
					<span className="absolute text-xs font-medium text-white uppercase right-1"> No </span>
					<span className="absolute text-xs font-medium text-white uppercase right-8"> Yes </span>
					<span className="absolute transition-transform transform bg-gray-200 rounded-full dark:bg-gray-700 w-7 h-7 right-7"></span>
				</label>
			</div>
			<label className="mt-3 text-xs font-semibold" htmlFor="title">
				Title
			</label>
			<input
				className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
				type="text"
				name="title"
				id="title"
				value={query.title}
			/>
			<label className="mt-3 text-xs font-semibold" htmlFor="description">
				Description
				<img
					src="https://www.markdownguide.org/favicon.ico"
					alt="Markdown Compatible"
					title="Markdown Compatible"
					className="inline-block pl-1 dark:invert"
				/>
			</label>
			<textarea
				className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
				type="text"
				name="description"
				id="description"
			>
				{query.description}
			</textarea>
			<label className="mt-3 text-xs font-semibold" htmlFor="markers">
				Markers (H:M:S Title Description)
			</label>
			<textarea
				className="flex items-center min-w-[12rem] h-12 pr-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
				type="text"
				name="markers"
				id="markers"
			>
				{query.markers}
			</textarea>
			<button
				className="flex items-center justify-center min-w-[12rem] h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded md:min-w-[16rem] hover:bg-blue-700"
				type="submit"
			>
				Create
			</button>
		</form>
	);
}

export default withLayout('Main', New);
