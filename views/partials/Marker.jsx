import React from 'react';
import { secondsToHMS } from '../helpers';

export default function Marker({ marker }) {
	return (
		<div className="w-full px-1 my-1 md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 xl:w-1/4">
			<article className="overflow-hidden rounded-lg shadow-lg dark:shadow-slate-600 bg-slate-200 hover:bg-slate-400 outline-1 outline-slate-400 outline hover:outline-slate-900 dark:bg-slate-800 dark:hover:outline-slate-100 dark:hover:bg-slate-600 dark:text-slate-50">
				<div className="relative">
					<a
						href={`/v/${marker.collectionRef.entity.id}/${marker.collectionRef.id}?t=${secondsToHMS(
							marker.when,
							'hms'
						)}`}
					>
						<img
							alt={`${marker.collectionRef.entity.title} thumbnail`}
							className="block w-full h-auto"
							src={marker.collectionRef.entity.thumbnail}
						/>
					</a>
					<div
						className="absolute z-10 font-mono text-white bottom-0 left-0 bg-[rgba(0,0,0,0.85)] rounded-md rounded-bl-none border border-slate-400 px-1"
						alt="Marker Time"
						title="Marker Time"
					>
						{secondsToHMS(marker.when)}
					</div>
					{marker.collectionRef.entity.duration ? (
						<div
							className="absolute z-10 font-mono text-white bottom-0 right-0 bg-[rgba(0,0,0,0.85)] rounded-md rounded-br-none border border-slate-400 px-1"
							alt="Duration"
							title="Duration"
						>
							{secondsToHMS(marker.collectionRef.entity.duration)}
						</div>
					) : null}
				</div>

				<header className="flex flex-col items-center justify-between p-2 leading-tight">
					<h1 className="w-full text-lg">
						<div className="relative flex group">
							<a
								href={`/v/${marker.collectionRef.entity.id}/${
									marker.collectionRef.id
								}?t=${secondsToHMS(marker.when, 'hms')}`}
								className="inline-block w-full underline truncate underline-offset-2 hover:underline-offset-1"
							>
								{!marker.collectionRef.public ? (
									<i className="fa fa-lock" alt="Private" title="Private"></i>
								) : null}
								{marker.collectionRef.entity.title}
							</a>
							<span className="group-hover:inline-block bg-gray-800 border border-slate-200 px-1 z-20 text-sm  rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+4rem)] m-4 mx-auto text-center w-full hidden">
								{marker.collectionRef.entity.title}
							</span>
						</div>
					</h1>
					<h2 className="w-full text-md">
						<div className="relative flex group">
							<a
								href={`/v/${marker.collectionRef.entity.id}/${
									marker.collectionRef.id
								}?t=${secondsToHMS(marker.when, 'hms')}`}
								className="inline-block w-full underline truncate underline-offset-2 hover:underline-offset-1"
							>
								{marker.title}
							</a>
							<span className="group-hover:inline-block bg-gray-800 border border-slate-200 px-1 z-20 text-sm rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+5.75rem)] m-4 mx-auto text-center w-full hidden">
								{marker.title}
							</span>
						</div>
					</h2>
				</header>

				<footer className="flex items-center justify-between p-2 leading-none underline underline-offset-2 hover:underline-offset-1">
					<a href={`/profile/${marker.collectionRef.author.username}`} className="w-1/6">
						<img
							alt=""
							className="block rounded-full"
							src={marker.collectionRef.author.avatarURL}
						/>
					</a>

					<a
						href={
							'/v/' +
							marker.collectionRef.entity.id +
							'/' +
							marker.collectionRef.id +
							'?t=' +
							secondsToHMS(marker.when, 'hms')
						}
						className="relative inline-flex items-center p-3 text-sm font-medium text-center"
					>
						{marker.collectionRef.title}
						<div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white border-2 rounded-full border-slate-200 dark:border-slate-800 bg-amber-700 -top-1 -right-1">
							{marker.collectionRef.markerCount}
						</div>
					</a>
				</footer>
			</article>
		</div>
	);
}
