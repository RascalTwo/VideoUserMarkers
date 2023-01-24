import React from 'react';
import { secondsToHMS, secondsToHuman, secondsToPTDuration } from '../helpers';

export default function Collection({ collection }) {
	return (
		<div className="w-full px-1 my-1 md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 xl:w-1/4">
			<article className="overflow-hidden rounded-lg shadow-lg dark:shadow-slate-600 bg-slate-200 hover:bg-slate-400 outline-1 outline-slate-400 outline hover:outline-slate-900 dark:bg-slate-800 dark:hover:outline-slate-100 dark:hover:bg-slate-600 dark:text-slate-50">
				<div className="relative group">
					<a href={`/v/${collection.entity.id}/${collection.id}`}>
						<img
							alt={'{collection.entity.title} thumbnail'}
							className="block w-full h-auto"
							src={collection.entity.thumbnail}
						/>
					</a>
					<div className="absolute top-0 left-0 z-10 flex-row hidden gap-1 px-1 bg-slate-50 group-hover:flex rounded-br-md dark:text-black">
						<time
							dateTime={collection.createdAt}
							alt={`Created at ${collection.createdAt}`}
							title={`Created at ${collection.createdAt}`}
						>
							<i className="fa fa-calendar-o"></i>
						</time>
						{collection.updatedAt !== collection.createdAt && (
							<time
								dateTime={collection.updatedAt}
								alt={`Updated at ${collection.updatedAt}`}
								title={`Updated at ${collection.updatedAt}`}
							>
								<i className="fa fa-calendar"></i>
							</time>
						)}
					</div>
					{collection.entity.duration ? (
						<time
							dateTime={'PT' + secondsToPTDuration(collection.entity.duration)}
							className="absolute z-10 font-mono bottom-0 right-0 bg-[rgba(0,0,0,0.85)] rounded-md rounded-br-none border text-white border-slate-400 px-1"
							alt={secondsToHuman(collection.entity.duration)}
							title={secondsToHuman(collection.entity.duration)}
						>
							{secondsToHMS(collection.entity.duration)}
						</time>
					) : null}
				</div>

				<header className="flex items-center justify-between p-2 leading-tight">
					<h1 className="w-full text-lg ">
						<div className="relative flex group">
							<a
								href={`/v/${collection.entity.id}/${collection.id}`}
								className="inline-block w-full underline truncate underline-offset-2 hover:underline-offset-1"
							>
								{!collection.public ? (
									<i className="fa fa-lock" alt="Private" title="Private"></i>
								) : null}
								{collection.entity.title}
							</a>
							<span className="group-hover:inline-block bg-gray-800 px-1 z-20 border border-slate-200 text-sm rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+4rem)] m-4 mx-auto text-center w-full hidden">
								{collection.entity.title}
							</span>
						</div>
					</h1>
				</header>

				<footer className="flex items-center justify-between p-2 leading-none underline underline-offset-2 hover:underline-offset-1">
					<a href={`/profile/${collection.author.username}`} className="w-1/6">
						<img alt="" className="block rounded-full" src={collection.author.avatarURL} />
					</a>

					<a
						href={`/v/${collection.entity.id}/{collection.id}`}
						className="relative inline-flex items-center p-3 text-sm font-medium text-center"
					>
						{collection.title}
						<div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white border-2 rounded-full border-slate-200 dark:border-slate-800 bg-amber-700 -top-1 -right-1">
							{collection.markerCount}
						</div>
					</a>
				</footer>
			</article>
		</div>
	);
}
