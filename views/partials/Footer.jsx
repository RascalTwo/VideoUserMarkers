import React from 'react';

export default function Footer({ version }) {
	return (
		<footer className="flex z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] shadow-slate-400 dark:shadow-slate-600 justify-between pt-2 px-1 text-right dark:text-gray-300 bg-slate-100/30 dark:bg-gray-900/30">
			<div className="theme-switch">
				<input type="checkbox" className="theme-switch__input" id="theme-toggler" />
				<label
					className="theme-switch__label"
					htmlFor="theme-toggler"
					aria-label="Switch to dark theme"
				>
					<span className="theme-switch__indicator"></span>
					<span className="theme-switch__decoration"></span>
				</label>
			</div>
			<script
				dangerouslySetInnerHTML={{
					__html: `
				const themeSwitch = document.querySelector('#theme-toggler');
				themeSwitch.addEventListener('change', function() {
					const isDark = document.documentElement.classList.toggle('dark');
					localStorage.setItem('r2Theme', isDark ? 'dark' : 'light');
				});
				themeSwitch.checked = !document.documentElement.classList.contains('dark');
			`,
				}}
			></script>
			<a href="https://github.com/RascalTwo/VideoUserMarkers">
				<img
					alt={`Version ${version} icon`}
					src={`https://img.shields.io/badge/VERSION-${version}-blue?style=for-the-badge&logo=github`}
				/>
			</a>
			<p>
				Copyright © 2022 <a href="https://josephmilliken.com">Joseph Milliken</a>. All rights
				reserved
			</p>
		</footer>
	);
}
