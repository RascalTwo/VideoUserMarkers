import React from 'react';
import CardContainer from './CardContainer';
import { sortArrayBy } from '../helpers';
import Card from './Card';

export default function Collections({ collections, query }) {
	return (
		<CardContainer>
			{sortArrayBy(collections, query.sort, query.descending).map(collection => (
				<Card
					key={collection._id}
					collection={collection}
					entity={collection.entity}
					type="collection"
				/>
			))}
		</CardContainer>
	);
}
