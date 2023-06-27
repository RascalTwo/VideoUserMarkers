import React from 'react';
import withLayout from '../layouts';

function Render({ collection, html, user, NODE_ENV }) {
	return (
		<>
			<h1 className="pt-3 text-xl text-center">
				<a
					className="underline underline-offset-2 hover:underline-offset-1 hover:animate-pulse"
					href={`/v/${encodeURIComponent(collection.entity._id)}`}
				>
					{collection.entity.title}
				</a>
			</h1>
			<h2 className="pt-3 text-xl text-center">
				{!collection.public ? (
					<i className="pr-1 fa fa-lock" alt="Private" title="Private"></i>
				) : null}
				{collection.title}
				{collection.author ? (
					<>
						{' by '}
						<a
							className="underline underline-offset-2 hover:underline-offset-1 hover:animate-pulse"
							href={`/profile/${collection.author.username}`}
						>
							{collection.author.username}
						</a>
					</>
				) : null}
			</h2>
			{html.collection.description ? (
				<div dangerouslySetInnerHTML={{ __html: html.collection.description }}></div>
			) : null}

			<div id="root" className="px-4"></div>

			<script src="https://player.twitch.tv/js/embed/v1.js"></script>
			<script
				src={`https://unpkg.com/react@18/umd/react.${
					NODE_ENV === 'production' ? 'production.min' : 'development'
				}.js`}
				crossOrigin
			></script>
			<script
				src={`https://unpkg.com/react-dom@18/umd/react-dom.${
					NODE_ENV === 'production' ? 'production.min' : 'development'
				}.js`}
				crossOrigin
			></script>
			<script
				src="/collection/render.js"
				type="module"
				data-user={JSON.stringify(user)}
				data-collection={JSON.stringify(collection)}
			></script>
		</>
	);
}
export default withLayout('Main', Render);
