import React from 'react';
import withLayout from '../layouts';

function New({ query }) {
	const checkedType = (() => {
		if (query.type) return query.type;
		if (!query.entity) return null;
		if (query.entity.length === 11) return 'YouTube';
		if (query.entity.length === 10) return 'Twitch';
		return 'File';
	})();
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
			<div className="flex justify-between gap-2 mt-3">
				<span className="flex items-center text-xs font-semibold">Type</span>
				<div className="flex items-center justify-center">
					<div className="inline-flex" role="group">
						<span>
							<input
								name="type"
								type="radio"
								hidden
								required
								{...(checkedType === 'YouTube' ? { defaultChecked: true } : {})}
								value="YouTube"
								id="type-youtube"
								className="peer"
							/>
							<label
								htmlFor="type-youtube"
								className="p-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border-2 rounded-l text-gray-300/50 border-gray-300/50 peer-checked:border-red-600 peer-checked:text-red-600 hover:bg-opacity-5 focus:outline-none focus:ring-0"
							>
								<svg
									viewBox="0 0 28.5 20"
									preserveAspectRatio="xMidYMid meet"
									className="inline w-5 h-5"
									alt="YouTube"
									title="YouTube"
								>
									<g preserveAspectRatio="xMidYMid meet">
										<path
											d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
											fill="currentColor"
										></path>
										<path
											d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
											fill="white"
										></path>
									</g>
								</svg>
							</label>
						</span>
						<span>
							<input
								name="type"
								type="radio"
								hidden
								required
								{...(checkedType === 'Twitch' ? { defaultChecked: true } : {})}
								value="Twitch"
								id="type-twitch"
								className="peer"
							/>
							<label
								htmlFor="type-twitch"
								className="p-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border-2 text-gray-300/50 border-gray-300/50 peer-checked:border-[#A970FF] hover:bg-opacity-5 focus:outline-none focus:ring-0 peer-checked:text-[#A970FF]"
							>
								<svg
									overflow="visible"
									width="40px"
									height="40px"
									version="1.1"
									viewBox="0 0 40 40"
									x="0px"
									y="0px"
									className="inline w-5 h-5"
								>
									<g>
										<polygon
											points="13 8 8 13 8 31 14 31 14 36 19 31 23 31 32 22 32 8"
											fill="currentColor"
										></polygon>
										<polygon
											points="26 25 30 21 30 10 14 10 14 25 18 25 18 29 22 25"
											fill="white"
										></polygon>
									</g>
									<g>
										<path
											d="M20,14 L22,14 L22,20 L20,20 L20,14 Z M27,14 L27,20 L25,20 L25,14 L27,14 Z"
											fill="currentColor"
										></path>
									</g>
								</svg>
							</label>
						</span>
						<span>
							<input
								name="type"
								type="radio"
								hidden
								required
								{...(checkedType === 'File' ? { defaultChecked: true } : {})}
								value="File"
								id="type-file"
								className="peer"
							/>
							<label
								htmlFor="type-file"
								className="p-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border-2 rounded-r text-gray-300/50 border-gray-300/50 peer-checked:border-green-600 peer-checked:text-green-600 hover:bg-opacity-5 focus:outline-none focus:ring-0"
							>
								<i className="fa fa-file-video-o" alt="File" title="File"></i>
							</label>
						</span>
					</div>
				</div>
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
