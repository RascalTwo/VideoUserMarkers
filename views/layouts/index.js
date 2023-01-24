import React from 'react';
import Main from './Main';

const layouts = {
	Main,
};

export default function withLayout(layoutName, Component) {
	return function LayoutWrapper(props) {
		const Layout = layouts[layoutName];
		return (
			<Layout {...props}>
				<Component {...props} />
			</Layout>
		);
	};
}
