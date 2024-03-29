import React from 'react';
import withLayout from './layouts';
import Sorting from './partials/Sorting';
import Collections from './partials/Collections';

function Profile({ profiling, user, ...props }) {
	return (
		<>
			<h1>
				{profiling.username}
				{profiling.id === user?.id ? (
					<>
						<a
							href="/auth/logout"
							alt="Logout"
							title="Logout"
							className="relative hover:animate-pulse inline-flex hover:animate-pulse items-center px-2 ml-1 border rounded-full bg-slate-50 dark:bg-slate-900 hover:shadow-lg dark:border-slate-700 dark:hover:shadow-slate-700"
						>
							<div className="flex items-center flex-grow-0 flex-shrink-0 h-10 cursor-pointer">
								<i className="fa fa-sign-out" />
							</div>
						</a>
						{user?.isAdmin ? (
							<a
								href="/admin/delete-orphans"
								className="flex hover:animate-pulse items-center justify-center w-24 h-12 px-6 mt-8 text-sm font-semibold text-center text-red-100 bg-red-600 rounded md:w-32 hover:bg-red-700"
							>
								Delete Orphans
							</a>
						) : null}
					</>
				) : null}
			</h1>
			<Sorting
				fields={{
					title: 'Title',
					createdAt: 'Created Time',
					updatedAt: 'Updated Time',
					'entity.createdAt': 'Entity Created Time',
				}}
				{...props}
			/>
			<Collections collections={profiling.collections} {...props} />
		</>
	);
}
export default withLayout('Main', Profile);
