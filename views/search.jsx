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
				values={{ search: query.search, filter: query.filter }}
				query={query}
			/>
			<CardContainer>
				{sortArrayBy(matches, query.sort, query.descending).map(match => {
					let collection, entity, marker, badge;
					switch (match.type) {
						case 'collection':
							collection = match;
							entity = match.entity;
							marker = null;
							badge = <i className="fa fa-book" alt="Collection" title="Collection" />;
							break;
						case 'marker':
							collection = match.collectionRef;
							entity = match.collectionRef.entity;
							marker = match;
							badge = <i className="fa fa-bookmark" alt="Marker" title="Marker" />;
							break;
						case 'entity':
							collection = null;
							entity = match;
							marker = null;
							badge = <i className="fa fa-file" alt="Entity" title="Entity" />;
					}
					return (
						<Card
							key={match._id}
							type={match.type}
							collection={collection}
							entity={entity}
							marker={marker}
							badge={badge}
							highlightText={query.search}
						/>
					);
				})}
			</CardContainer>
		</>
	);
}

export default withLayout('Main', Search);
