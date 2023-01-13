import Collection from './Collection.js';

const { useState } = React;

export default function App({ initialCollection, user, isEmbed }) {
	const [collection, setCollection] = useState(initialCollection);

	return (
		<Collection
			collection={collection}
			setCollection={setCollection}
			user={user}
			isEmbed={isEmbed}
		/>
	);
}
