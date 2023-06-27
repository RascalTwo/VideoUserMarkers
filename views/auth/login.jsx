import React from 'react';
import withLayout from '../layouts';

function Login({ query }) {
	return (
		<form
			className="flex flex-col p-6 mt-6 rounded shadow-lg bg-slate-50 dark:bg-slate-900 dark:shadow-slate-700"
			method="POST"
		>
			<label className="text-xs font-semibold" htmlFor="username">
				Username
			</label>
			<input
				className="flex items-center h-12 px-4 min-w-[12rem] md:min-w-[16rem] bg-gray-200 dark:bg-gray-800 mt-2 rounded focus:outline-none focus:ring-2"
				type="text"
				name="username"
				id="username"
				value={query.username}
				autoFocus
			/>
			<label className="mt-3 text-xs font-semibold" htmlFor="password">
				Password
			</label>
			<input
				className="flex items-center h-12 px-4 min-w-[12rem] md:min-w-[16rem] bg-gray-200 dark:bg-gray-800 mt-2 rounded focus:outline-none focus:ring-2"
				type="password"
				name="password"
				id="password"
				value={query.password}
			/>
			<button
				className="flex hover:animate-pulse items-center justify-center h-12 px-6 min-w-[12rem] md:min-w-[16rem] bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
				type="submit"
			>
				Log In
			</button>
			<div className="flex justify-center gap-2 mt-3 text-xs">
				<a className="hover:animate-pulse text-blue-400 hover:text-blue-500" href="/auth/signup">
					Sign Up
				</a>
			</div>
		</form>
	);
}

export default withLayout('Main', Login);
