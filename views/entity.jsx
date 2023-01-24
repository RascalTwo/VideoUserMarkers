import React from 'react';
import { hmsToSeconds } from './helpers';
import withLayout from './layouts';
import Collections from './partials/Collections';

function Entity({ user, entity, query }) {
	return (
		<>
			<h1 className="py-3 text-xl text-center">
				{user.isAdmin ? (
					<a
						href={`/v/${entity.id}?refetch`}
						alt="Refetch Entity"
						title="Refetch Entity"
						className="relative inline-flex items-center px-2 border rounded-full dark:bg-slate-900 bg-slate-50 hover:shadow-lg dark:hover:shadow-slate-700 dark:border-slate-700"
					>
						<div className="flex items-center flex-grow-0 flex-shrink-0 h-10 cursor-pointer">
							<i className="fa fa-refresh"></i>
						</div>
					</a>
				) : null}
				{entity.title}
				{user ? (
					<a
						href={`/v?entity=${entity.id}`}
						alt="Create Collection"
						title="Create Collection"
						className="relative inline-flex items-center px-2 border rounded-full dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:shadow-lg dark:hover:shadow-slate-700"
					>
						<div className="flex items-center flex-grow-0 flex-shrink-0 h-10 cursor-pointer">
							<i className="fa fa-plus"></i>
						</div>
					</a>
				) : null}
			</h1>

			{entity.type === 'YouTube' ? (
				<iframe
					className="w-10/12 m-auto aspect-video"
					src={`https://www.youtube.com/embed/${entity._id}?start=${
						query.t ? hmsToSeconds(query.t) : '0'
					}`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe>
			) : (
				<iframe
					className="w-10/12 m-auto aspect-video"
					src={`https://player.twitch.tv/?video=${entity._id}&time=${query.t}&parent=example.com`}
					allowFullScreen
				></iframe>
			)}
			<div className="flex flex-row w-10/12 gap-1">
				<time dateTime={entity.createdAt} alt={entity.createdAt} title={entity.createdAt}>
					<i className="fa fa-calendar-o"></i>
				</time>
			</div>
			<Collections collections={entity.collections} query={query} />
		</>
	);
}

export default withLayout('Main', Entity);
