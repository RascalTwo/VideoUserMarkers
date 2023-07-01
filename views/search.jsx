import React from 'react';
import CardContainer from './partials/CardContainer';
import { sortArrayBy } from './helpers';
import withLayout from './layouts';
import Sorting from './partials/Sorting';
import Card from './partials/Card';

function Search({ matches, query }) {
	return (
		<>
			<Sorting
				fields={{
					matchRatio: 'Text Match Ratio',
					title: 'Title',
					createdAt: 'Created Time',
					updatedAt: 'Updated Time',
					'entity.createdAt': 'Entity Created Time',
				}}
				values={{ search: query.search }}
				query={query}
			/>
			<CardContainer>
				{sortArrayBy(matches, query.sort, query.descending).map(match => (
					<Card
						key={match._id}
						type={match.type}
						collection={match.type === 'collection' ? match : match.collectionRef}
						entity={match.type === 'collection' ? match.entity : match.collectionRef.entity}
						marker={match.type === 'marker' ? match : null}
					/>
				))}
			</CardContainer>
		</>
	);
}

export default withLayout('Main', Search);
