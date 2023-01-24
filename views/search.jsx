import React from 'react';
import { sortArrayBy } from './helpers';
import withLayout from './layouts';
import Collection from './partials/Collection';
import Marker from './partials/Marker';
import Sorting from './partials/Sorting';

function Search({ matches, query }) {
	return (
		<>
			<Sorting
				fields={{
					matchRatio: 'Total Match',
					title: 'Title',
					createdAt: 'Created',
					updatedAt: 'Updated',
				}}
				values={{ search: query.search }}
				query={query}
			/>
			<div className="container px-4 mx-auto my-12 md:px-12">
				<div className="flex flex-wrap -mx-1 rounded-md shadow-md justify-evenly dark:shadow-slate-700 lg:-mx-4 bg-slate-300/75 dark:bg-slate-700/75">
					{sortArrayBy(matches, query.sort, query.descending).map(match =>
						match.type === 'collection' ? (
							<Collection key={match._id} collection={match} search={query.search} />
						) : (
							<Marker key={match._id} marker={match} search={query.search} />
						)
					)}
				</div>
			</div>
		</>
	);
}

export default withLayout('Main', Search);
