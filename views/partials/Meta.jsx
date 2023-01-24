import React from 'react';

export default function Meta({ isDiscordBot, title, description, image, origin, path }) {
	const metaTitle = <meta property="og:title" content={title} />;
	const metaDescription = <meta property="og:description" content={description} />;
	return (
		<>
			{isDiscordBot ? (
				<>
					{metaTitle}
					{metaDescription}
					{image ? <meta property="og:image" content={image} /> : null}

					<meta name="twitter:card" content="summary_large_image"></meta>
				</>
			) : (
				<>
					<meta name="description" content={description} />
					<meta property="og:type" content="website" />
					{metaTitle}
					{metaDescription}
					<meta property="og:url" content={origin} />
					{image ? (
						<>
							<meta name="image" property="og:image" content={image} />
							<meta property="og:image:secure_url" content={image} />
						</>
					) : null}
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:domain" content={origin} />
					<meta name="twitter:title" content={title} />
					<meta name="twitter:description" content={description} />
					{image ? <meta name="twitter:image" content={image} /> : null}
					<meta name="twitter:site" content="@RealRascalTwo" />
					<meta name="twitter:creator" content="@RealRascalTwo" />
				</>
			)}
			<link type="application/json+oembed" href={`${origin}/oembed${path}`}></link>
		</>
	);
}
