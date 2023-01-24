import React from 'react';
import withLayout from './layouts';

function Error({ heading, preMessage, message, postMessage }) {
	return (
		<section className="flex items-center p-16">
			<div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
				<div className="max-w-md text-center">
					<h2 className="mb-8 font-extrabold text-9xl dark:text-slate-600">
						<span className="sr-only">Error</span>
						{heading}
					</h2>
					{preMessage ? <p className="text-2xl font-semibold md:text-3xl">{preMessage}:</p> : null}
					<pre>
						<code>{message || ''}</code>
					</pre>
					<p className="mt-4 mb-8 dark:text-slate-400">{postMessage || ''}</p>
					<a
						rel="noopener noreferrer"
						href="/"
						className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-slate-900"
					>
						Back to homepage
					</a>
				</div>
			</div>
		</section>
	);
}

export default withLayout('Main', Error);
