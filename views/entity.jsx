import React from 'react';
import { hmsToSeconds } from './helpers';
import withLayout from './layouts';
import Collections from './partials/Collections';

function Entity({ user, entity, query, origin }) {
	return (
		<>
			<h1 className="py-3 text-xl text-center">
				{user?.isAdmin ? (
					<a
						href={`/v/${encodeURIComponent(entity._id)}?refetch`}
						alt="Refetch Entity"
						title="Refetch Entity"
						className="relative hover:animate-pulse inline-flex items-center px-2 mr-1 border rounded-full dark:bg-slate-900 bg-slate-50 hover:shadow-lg dark:hover:shadow-slate-700 dark:border-slate-700"
					>
						<div className="flex items-center flex-grow-0 flex-shrink-0 h-10 cursor-pointer hover:animate-pulse">
							<i className="fa fa-refresh" />
						</div>
					</a>
				) : null}
				{entity.title}
				{user ? (
					<a
						href={`/v?entity=${encodeURIComponent(entity._id)}`}
						alt="Create Collection"
						title="Create Collection"
						className="relative hover:animate-pulse inline-flex items-center px-2 ml-1 border rounded-full dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:shadow-lg dark:hover:shadow-slate-700"
					>
						<div className="flex items-center flex-grow-0 flex-shrink-0 h-10 cursor-pointer hover:animate-pulse">
							<i className="fa fa-plus" />
						</div>
					</a>
				) : null}
			</h1>

			{entity.type === 'YouTube' ? (
				<iframe
					className="w-10/12 m-auto max-h-[75vh] aspect-video"
					src={`https://www.youtube.com/embed/${entity._id}?start=${
						query.t ? hmsToSeconds(query.t) : '0'
					}`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe>
			) : entity.type === 'Twitch' ? (
				<iframe
					className="w-10/12 m-auto max-h-[75vh] aspect-video"
					src={`https://player.twitch.tv/?video=${entity._id}&time=${query.t}&parent=${
						origin.split('//')[1].split('/')[0].split(':')[0]
					}`}
					allowFullScreen
				></iframe>
			) : (
				<video src={entity._id} controls playsInline preload="metadata"></video>
			)}
			{entity.createdAt ? (
				<div className="flex flex-row w-8/12 max-h-[75vh] gap-1">
					<time dateTime={entity.createdAt} alt={entity.createdAt} title={entity.createdAt}>
						<i className="fa fa-calendar-o" />
					</time>
				</div>
			) : null}
			<Collections collections={entity.collections} query={query} />
		</>
	);
}

export default withLayout('Main', Entity);
