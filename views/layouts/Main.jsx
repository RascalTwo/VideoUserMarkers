import React from 'react';
import Meta from '../partials/Meta.jsx';
import Footer from '../partials/Footer.jsx';

export default function Main(props) {
	const { title, messages, meta, user, children, query, url } = props;
	return (
		<>
			<head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{title ? <title>Video User Markers - {title}</title> : <title>Video User Markers</title>}

				<Meta
					image={meta?.image}
					description={meta?.description || 'Use markers on any content!'}
					{...props}
				/>

				<link
					rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
				/>
				<link rel="stylesheet" href="/index.css" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
					if (localStorage.r2Theme === 'dark' || (!('r2Theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
				`,
					}}
				></script>
			</head>

			<body className="flex flex-col w-screen h-screen">
				<nav className="relative z-30 flex items-center justify-between w-full h-13 px-8 mx-auto shadow-md shadow-slate-400 dark:shadow-slate-600 bg-slate-100/75 dark:bg-gray-900/75 dark:text-slate-50 text-slate-900">
					<div className="inline-flex">
						<a href="/" className="hover:animate-pulse ">
							<img src="/favicon.svg" alt="Logo" className="h-8" />
						</a>
					</div>

					<div className="justify-start flex-grow-0 flex-shrink hidden px-2 sm:block">
						<div className="inline-block">
							<div className="inline-flex items-center">
								<form
									className="relative py-2 mx-auto text-gray-600 dark:text-gray-300"
									action="/search"
								>
									{Object.entries(query)
										.filter(([key]) => !['search', 'filter'].includes(key))
										.filter(([key]) => !url.includes(key))
										.map(([key, value]) => (
											<input key={key} type="hidden" name={key} defaultValue={value} />
										))}
									<input
										className="h-10 px-5 pr-8 text-sm border-2 border-gray-300 rounded-lg dark:border-gray-700 bg-slate-100 dark:bg-slate-800"
										type="search"
										name="search"
										placeholder="Search"
										defaultValue={query.search}
									/>
									<button
										type="submit"
										className="absolute hover:animate-pulse top-0 right-4 mt-5 mr-2"
									>
										<svg
											className="w-4 h-4 text-gray-600 fill-current dark:text-gray-400"
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											version="1.1"
											id="Capa_1"
											x="0px"
											y="0px"
											viewBox="0 0 56.966 56.966"
											style={{ enableBackground: 'new 0 0 56.966 56.966' }}
											xmlSpace="preserve"
											width="512px"
											height="512px"
										>
											<path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
										</svg>
									</button>
									<details>
										<summary className="absolute top-0 -right-1 mt-4 mr-2 inline-block list-none cursor-pointer hover:animate-pulse w-4 h-4">
											<i className="fa fa-filter" alt="Filter" title="Filter" />
										</summary>
										<select
											multiple
											defaultValue={query.filter?.map(filter => filter.toLowerCase())}
											name="filter[]"
											className="absolute top-5 -right-24 mt-4 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										>
											{['Collection', 'Marker', 'Entity'].map(filter => (
												<option key={filter} value={filter.toLowerCase()}>
													{filter}
												</option>
											))}
										</select>
									</details>
								</form>
							</div>
						</div>
					</div>

					<div className="flex-initial">
						<div className="relative flex flex-row items-center justify-end gap-2">
							{user ? (
								<>
									<a
										href="/v"
										alt="Create Collection"
										title="Create Collection"
										className="relative hover:animate-pulse inline-flex items-center px-2 border rounded-full hover:shadow-lg dark:border-slate-700 dark:hover:shadow-slate-700"
									>
										<div className="flex items-center flex-grow-0 flex-shrink-0 h-10 cursor-pointer">
											<i className="fa fa-plus" />
										</div>
									</a>
									<a
										href={`/profile/${user.username}`}
										alt="View Profile"
										title="View Profile"
										className="relative hover:animate-pulse inline-flex items-center px-2 border rounded-full dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-700"
									>
										<div className="flex items-center flex-grow-0 flex-shrink-0 h-10">
											<img alt="" src={user.avatarURL} className="h-8 rounded-full" />
										</div>
									</a>
								</>
							) : (
								<div className="flex items-center mr-4">
									<a
										className="inline-block hover:animate-pulse px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
										href="/auth/login"
									>
										<span className="relative flex items-center cursor-pointer whitespace-nowrap">
											Start Creating
											<span className="flex items-center h-5 pl-2">
												<svg
													viewBox="0 0 16 16"
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
													role="presentation"
													focusable="false"
													style={{
														display: 'block',
														height: '16px',
														width: '16px',
														fill: 'currentcolor',
													}}
												>
													<path d="m8.002.25a7.77 7.77 0 0 1 7.748 7.776 7.75 7.75 0 0 1 -7.521 7.72l-.246.004a7.75 7.75 0 0 1 -7.73-7.513l-.003-.245a7.75 7.75 0 0 1 7.752-7.742zm1.949 8.5h-3.903c.155 2.897 1.176 5.343 1.886 5.493l.068.007c.68-.002 1.72-2.365 1.932-5.23zm4.255 0h-2.752c-.091 1.96-.53 3.783-1.188 5.076a6.257 6.257 0 0 0 3.905-4.829zm-9.661 0h-2.75a6.257 6.257 0 0 0 3.934 5.075c-.615-1.208-1.036-2.875-1.162-4.686l-.022-.39zm1.188-6.576-.115.046a6.257 6.257 0 0 0 -3.823 5.03h2.75c.085-1.83.471-3.54 1.059-4.81zm2.262-.424c-.702.002-1.784 2.512-1.947 5.5h3.904c-.156-2.903-1.178-5.343-1.892-5.494l-.065-.007zm2.28.432.023.05c.643 1.288 1.069 3.084 1.157 5.018h2.748a6.275 6.275 0 0 0 -3.929-5.068z"></path>
												</svg>
											</span>
										</span>
									</a>
								</div>
							)}
						</div>
					</div>
				</nav>
				{Object.keys(messages).flatMap((key, ki) =>
					messages[key].map((message, mi) => (
						<div
							className={`flex items-center px-4 py-3 text-sm font-bold text-white ${
								key === 'error' ? 'bg-red-500' : key === 'success' ? 'bg-green-500' : 'bg-blue-500'
							}`}
							role="alert"
							key={ki * 10 + mi}
						>
							<p>{message}</p>
						</div>
					))
				)}
				<main className="flex flex-col items-center flex-1 overflow-auto dark:text-slate-200">
					{children}
				</main>
				<Footer {...props} />
			</body>
		</>
	);
}
