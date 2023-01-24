import React from 'react';

export default function Embed({ collection, NODE_ENV }) {
	return (
		<>
			<link
				rel="stylesheet"
				href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
			/>
			<link rel="stylesheet" href="/index.css" />

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
				data-is-embed="true"
				data-collection={JSON.stringify(collection)}
			></script>
		</>
	);
}
