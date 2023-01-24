import React from 'react';

import withLayout from './layouts';

function Quickstart() {
	return (
		<section className="text-center">
			<p className="p-2">
				Getting started is easy, first go ahead and{' '}
				<a
					className="inline w-full underline truncate underline-offset-2 hover:underline-offset-1"
					href="/auth/signup"
				>
					create an account
				</a>
				, then choose if you&apos;ll be using this website or the Userscript/Extension.
			</p>

			<div className="w-10/12 m-auto border border-gray-100/25 tabbed bg-slate-200 dark:bg-slate-800/75">
				<input type="radio" className="hidden" id="userscript-extension" name="css-tabs" />
				<input type="radio" className="hidden" id="website" name="css-tabs" />

				<ul className="flex items-stretch justify-center p-0 list-none border-b-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 tabs">
					<li className="group tab">
						<label
							className="block p-3 text-xs font-semibold text-gray-500 uppercase transition-all border border-gray-300 cursor-pointer bg-slate-100 group-hover:border-t-gray-700 group-hover:text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:group-hover:border-t-gray-300 dark:group-hover:text-gray-300"
							htmlFor="userscript-extension"
						>
							Userscript/Extension
						</label>
					</li>
					<li className="group tab">
						<label
							className="block p-3 text-xs font-semibold text-gray-500 uppercase transition-all border border-gray-300 cursor-pointer bg-slate-100 group-hover:border-t-gray-700 group-hover:text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:group-hover:border-t-gray-300 dark:group-hover:text-gray-300"
							htmlFor="website"
						>
							Website
						</label>
					</li>
				</ul>

				<div className="hidden p-5 tab-content">
					<p>
						Giving you the freedom to use the native platform player, the userscript/extension gives
						the most seamless experience, allowing even anonymous users fully utilize the platform!
						<br />
						<br />
						You can find the installation instructions for both{' '}
						<a
							className="inline w-full underline truncate underline-offset-2 hover:underline-offset-1"
							href="https://github.com/RascalTwo/VideoUserMarkersUserscriptExtension#installation"
						>
							here
						</a>
						.
					</p>
					<br />
					<p>
						Now that you have it installed, you can visit any video that is compatible, and after a
						brief loading period you&apos;ll see below the video the{' '}
						<img src="/favicon.svg" className="inline" /> icon appear, indicating that it has loaded
						and is fully usable!
						<br /> <br />
						If there already exists a collection for the entity you&apos;ve visited, it&apos;ll be
						loaded by default, additionally you can explore the menu to manage the current, import
						others, and eventually export your own collection to this website for public sharing, or
						of course if you don&apos;t want to share your data with me, export the collection
						textually to a file for safe keeping.
					</p>
				</div>
				<div className="hidden p-5 tab-content">
					<p>
						With no installation required, this website has all features of the extension and
						userscript, the only limitation being that you need to use this website to experience
						it, and the player is custom and not the native platform player.
						<br />
						<br />
						First manually find the video you want to add markers to, and copy it&apos;s URL, then
						take that URL over to the{' '}
						<a
							className="inline w-full underline truncate underline-offset-2 hover:underline-offset-1"
							href="/v"
						>
							new collection form
						</a>{' '}
						and paste it in, and fill in the rest of the form!
						<br />
						<br />
						After that you&apos;ll be taken to your created collection, which at this point you can
						share the URL with others, or if you have more changes to make, you can use the custom
						player to add more markers, or edit existing ones.
						<br />
						<br />
						For the power-users out there, there are a plethora of Keyboard Shortcuts to aid in
						quick crafting of markers
					</p>
				</div>
			</div>
		</section>
	);
}

export default withLayout('Main', Quickstart);
