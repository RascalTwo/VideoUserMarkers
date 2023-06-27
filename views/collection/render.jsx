import React from 'react';
import withLayout from '../layouts';

function Render({ collection, user, NODE_ENV }) {
	return (
		<>
			<div id="root" className="px-2"></div>

			<script src="https://player.twitch.tv/js/embed/v1.js"></script>
			<script
				src={`https://unpkg.com/react@18/umd/react.${
					NODE_ENV === 'production' ? 'production.min' : 'development'
				}.js`}
				crossOrigin="true"
			></script>
			<script
				src={`https://unpkg.com/react-dom@18/umd/react-dom.${
					NODE_ENV === 'production' ? 'production.min' : 'development'
				}.js`}
				crossOrigin="true"
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
