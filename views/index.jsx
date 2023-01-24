import React from 'react';
import withLayout from './layouts';
import Collections from './partials/Collections.jsx';
import Sorting from './partials/Sorting.jsx';

function Index({ user, collections, heroImageSrc, ...props }) {
	return (
		<>
			<section>
				<div className="px-6 py-12 text-center md:px-12 lg:text-left">
					<div className="container mx-auto xl:px-32">
						<div className="grid items-center gap-12 lg:grid-cols-2">
							<div className="mt-12 lg:mt-0">
								<h1 className="mb-12 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
									Save & Share
								</h1>
								<p className="p-3 text-center rounded-lg bg-gray-100/50 dark:text-black">
									Save notes for any time-related content, easily searchable & sharable with your
									communities!
								</p>
								<br />
								<a
									className="inline-block py-3 mr-2 text-sm font-medium leading-snug text-gray-700 uppercase transition duration-150 ease-in-out bg-gray-200 rounded shadow-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 px-7 hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 dark:focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 dark:active:bg-gray-600 active:shadow-lg"
									data-mdb-ripple="true"
									data-mdb-ripple-color="light"
									href="/quickstart"
									role="button"
								>
									Quickstart
								</a>
								<a
									className="inline-block py-3 mr-2 text-sm font-medium leading-snug text-gray-700 uppercase transition duration-150 ease-in-out bg-gray-200 rounded shadow-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 px-7 hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 dark:focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 dark:active:bg-gray-600 active:shadow-lg"
									data-mdb-ripple="true"
									data-mdb-ripple-color="light"
									href={user ? '/v' : '/auth/signup'}
									role="button"
								>
									Start Creating
								</a>
							</div>
							<div className="mb-12 lg:mb-0">
								<img src={heroImageSrc} className="w-full rounded-lg shadow-lg" alt="" />
							</div>
						</div>
					</div>
				</div>
			</section>
			<div>
				<div className="px-6 mx-auto max-w-7xl lg:px-8">
					<div className="max-w-lg mt-20 sm:mx-auto md:max-w-none">
						<div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
							<div className="relative flex flex-col gap-6 p-2 rounded-lg bg-slate-200 dark:bg-slate-700 sm:flex-row md:flex-col lg:flex-row">
								<div className="flex items-center justify-center w-12 h-12 text-white bg-indigo-500 rounded-xl sm:shrink-0">
									<svg
										className="w-8 h-8"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
										/>
									</svg>
								</div>
								<div className=" sm:min-w-0 sm:flex-1">
									<p className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-200">
										Compatible
									</p>
									<p className="mt-2 text-base leading-7 text-gray-800 dark:text-gray-300">
										YouTube, Twitch, uploaded media files, even analog events - document with any
										form of content!
									</p>
								</div>
							</div>

							<div className="relative flex flex-col gap-6 p-2 rounded-lg bg-slate-200 dark:bg-slate-700 sm:flex-row md:flex-col lg:flex-row">
								<div className="flex items-center justify-center w-12 h-12 text-white bg-indigo-500 rounded-xl sm:shrink-0">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
										/>
									</svg>
								</div>
								<div className=" sm:min-w-0 sm:flex-1">
									<p className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-200">
										Private
									</p>
									<p className="mt-2 text-base leading-7 text-gray-800 dark:text-gray-300">
										Your data is yours - you&apos;re free to export it any time, but still use it
										with our applications!
									</p>
								</div>
							</div>

							<div className="relative flex flex-col gap-6 p-2 rounded-lg bg-slate-200 dark:bg-slate-700 sm:flex-row md:flex-col lg:flex-row">
								<div className="flex items-center justify-center w-12 h-12 text-white bg-indigo-500 rounded-xl sm:shrink-0">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
										/>
									</svg>
								</div>
								<div className=" sm:min-w-0 sm:flex-1">
									<p className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-200">
										Seamless
									</p>
									<p className="mt-2 text-base leading-7 text-gray-800 dark:text-gray-300">
										Seamless native-integration via the companion Web Extension, allowing for easier
										discovery & creation!
									</p>
								</div>
							</div>
							<div className="relative flex flex-col gap-6 p-2 rounded-lg bg-slate-200 dark:bg-slate-700 sm:flex-row md:flex-col lg:flex-row">
								<div className="flex items-center justify-center w-12 h-12 text-white bg-indigo-500 rounded-xl sm:shrink-0">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
										/>
									</svg>
								</div>
								<div className=" sm:min-w-0 sm:flex-1">
									<p className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-200">
										API
									</p>
									<p className="mt-2 text-base leading-7 text-gray-800 dark:text-gray-300">
										Easily usable API, allowing for integration into your own projects!
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative self-start">
				<Sorting
					fields={{ title: 'Title', createdAt: 'Created', updatedAt: 'Updated' }}
					{...props}
				/>
			</div>
			<h1 className="pt-4 text-2xl">Latest Collections</h1>

			<Collections collections={collections} {...props} />
		</>
	);
}

export default withLayout('Main', Index);
