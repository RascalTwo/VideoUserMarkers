import HMSInput from './HMSInput.js';
import Modal from './Modal.js';

const { useEffect, useState, useMemo } = React;

function secondsToHMS(seconds, delimiters = '::', minimalPlaces = 1) {
	delimiters = [...delimiters];
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor((seconds % 3600) % 60);
	const parts = [h, m, s];
	while (parts[0] === 0 && parts.length > minimalPlaces) {
		parts.shift();
		delimiters.shift();
	}
	return parts
		.map(part => part.toString().padStart(2, '0') + (delimiters.shift() || ''))
		.join('');
}

function base64encode(str) {
	let encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) =>
		String.fromCharCode(parseInt($1, 16))
	);
	return window.btoa(encode);
}

class Player {
	constructor(entityId) {
		this.entityId = entityId;
	}

	getDuration() {
		throw new Error('Not implemented');
	}

	getCurrentTime() {
		throw new Error('Not implemented');
	}

	seekTo(_seconds) {
		throw new Error('Not implemented');
	}

	setDimensions(_width, _height) {
		throw new Error('Not implemented');
	}

	onFirstPlay(_callback) {
		throw new Error('Not implemented');
	}

	isPlaying() {
		throw new Error('Not implemented');
	}

	play() {
		throw new Error('Not implemented');
	}

	pause() {
		throw new Error('Not implemented');
	}

	isMuted() {
		throw new Error('Not implemented');
	}

	mute() {
		throw new Error('Not implemented');
	}

	unMute() {
		throw new Error('Not implemented');
	}
}

class TwitchPlayer extends Player {
	constructor(videoId) {
		super(videoId);
		this.player = new Twitch.Player('player-embed', {
			video: videoId,
			parent: [window.location.hostname],
			autoplay: false,
		});
	}

	getDuration() {
		return this.player.getDuration();
	}

	getCurrentTime() {
		return this.player.getCurrentTime();
	}

	seekTo(seconds) {
		this.player.seek(seconds);
	}

	setDimensions(width, height) {
		this.player._iframe.style.width = `${width}px`;
		this.player._iframe.style.height = `${height}px`;
	}

	onFirstPlay(callback) {
		this.player.addEventListener(Twitch.Player.PLAY, () => {
			callback?.();
			callback = null;
		});
	}

	isPlaying() {
		return !this.player.isPaused();
	}

	play() {
		this.player.play();
	}

	pause() {
		this.player.pause();
	}

	isMuted() {
		return this.player.getMuted();
	}

	mute() {
		this.player.setMuted(true);
	}

	unMute() {
		this.player.setMuted(false);
	}
}

class YouTubePlayer extends Player {
	constructor(videoId) {
		super(videoId);
		this.player = new YT.Player('player-embed', {
			videoId,
			playerVars: {
				autoplay: 1,
				controls: 1,
				disablekb: 1,
				enablejsapi: 1,
				playsinline: 1,
			},
			events: {
				onReady: () => {
					this.player.setPlaybackQuality('small');
				},
			},
		});
	}

	getDuration() {
		return this.player.getDuration();
	}

	getCurrentTime() {
		return this.player.getCurrentTime();
	}

	seekTo(seconds) {
		this.player.seekTo(seconds);
	}

	setDimensions(width, height) {
		this.player.setSize(width, height);
	}

	onFirstPlay(callback) {
		this.player.addEventListener('onStateChange', event => {
			if (callback && event.data === YT.PlayerState.PLAYING) {
				callback();
				callback = null;
			}
		});
	}

	isPlaying() {
		return this.player.getPlayerState() === YT.PlayerState.PLAYING;
	}

	play() {
		this.player.playVideo();
	}

	pause() {
		this.player.pauseVideo();
	}

	isMuted() {
		return this.player.isMuted();
	}

	mute() {
		this.player.mute();
	}

	unMute() {
		this.player.unMute();
	}
}

class FilePlayer extends Player {
	constructor(url) {
		super(url);
		this.player = document.createElement('video');
		this.player.src = url;
		this.player.controls = true;
		this.player.playsinline = true;
		this.player.preload = 'metadata';
		document.querySelector('#player-embed').appendChild(this.player);
	}

	getDuration() {
		return this.player.duration;
	}

	getCurrentTime() {
		return this.player.currentTime;
	}

	seekTo(seconds) {
		this.player.currentTime = seconds;
	}

	setDimensions(width, height) {
		this.player.style.width = `${width}px`;
		this.player.style.height = `${height}px`;
	}

	onFirstPlay(callback) {
		this.player.addEventListener('play', () => {
			callback?.();
			callback = null;
		});
	}

	isPlaying() {
		return !this.player.paused;
	}

	play() {
		this.player.play();
	}

	pause() {
		this.player.pause();
	}

	isMuted() {
		return this.player.muted;
	}
}

export default function Collection({
	collection: {
		_id,
		entity: { _id: entityId, type, ...entity },
		title,
		description,
		markers: initialMarkers,
		public: isPublic,
		createdAt,
		updatedAt,
		author,
	},
	setCollection,
	user,
	isEmbed,
	canEdit,
}) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (ready) return;
		if (type === 'Twitch') return setReady(true);
		window.onYouTubeIframeAPIReady = () => setReady(true);
		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';

		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}, [ready, entityId, type]);

	const [columnCount, setColumns] = useState(window.innerWidth >= 1024 ? 2 : 1);
	const [markers, setMarkers] = useState(initialMarkers.sort((a, b) => a.when - b.when));

	const [player, setPlayer] = useState();
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	useEffect(() => {
		if (!ready) return;
		const player =
			type === 'YouTube'
				? new YouTubePlayer(entityId)
				: type === 'Twitch'
					? new TwitchPlayer(entityId)
					: new FilePlayer(entityId);
		player.onFirstPlay(() => {
			setPlayer(player);
			setDuration(player.getDuration());
			const requestedTime = new URLSearchParams(window.location.search).get('t');
			if (requestedTime)
				player.seekTo(
					requestedTime
						.split(/(\d+[a-z]+)/i)
						.filter(Boolean)
						.reduce((seconds, string) => {
							const multiplier = string.endsWith('h') ? 3600 : string.endsWith('m') ? 60 : 1;
							return seconds + parseInt(string) * multiplier;
						}, 0)
				);
		});
	}, [ready, entityId, type]);

	useEffect(() => {
		if (!player) return;
		const interval = setInterval(() => setCurrentTime(player.getCurrentTime()), 100);
		return () => clearInterval(interval);
	}, [player, setCurrentTime]);

	useEffect(() => {
		if (!player) return;
		const params = new URLSearchParams(window.location.search);
		params.set('t', secondsToHMS(currentTime, 'hms'));
		window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
	}, [player, currentTime]);

	useEffect(() => {
		if (!player) return;

		const resizeListener = () => {
			if (isEmbed) return player.setDimensions(window.innerWidth, (window.innerWidth * 9) / 16);

			let ratio = window.innerWidth < window.innerHeight ? 0.85 : 0.75;
			if (columnCount === 2) ratio -= 0.1;

			const maxWidth = window.innerWidth * ratio;
			player.setDimensions(maxWidth, (maxWidth * 9) / 16);
		};
		resizeListener();

		window.addEventListener('resize', resizeListener);
		return () => window.removeEventListener('resize', resizeListener);
	}, [player, columnCount]);

	const [addingAt, setAddingAt] = useState(null);
	useEffect(() => {
		if (!player) return;

		if (player.isPlaying() && addingAt) player.pause();
		else if (!player.isPlaying() && !addingAt) player.play();
	}, [player, addingAt, setAddingAt]);

	const [selectedMarker, setSelectedMarker] = useState(null);

	const [activeMarker, setActiveMarker] = useState(null);
	useEffect(() => {
		setActiveMarker([...markers].reverse().find(marker => marker.when <= currentTime) ?? null);
	}, [markers, currentTime]);

	function togglePlayState() {
		if (!player) return;

		if (player.isPlaying()) player.pause();
		else player.play();
	}

	function seekRelativeMarker(change) {
		if (!player) return;

		setMarkers(markers => {
			setActiveMarker(activeMarker => {
				setTimeout(
					() =>
						document.querySelector('[data-active-marker="true"]')?.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
						}),
					100
				);
				const index = markers.findIndex(marker => marker === activeMarker);
				if (index === -1) {
					player.seekTo(markers[0].when);
					return activeMarker;
				}

				const newIndex = index + change;
				if (newIndex < 0 || newIndex >= markers.length) return activeMarker;
				player.seekTo(markers[newIndex].when);
				return activeMarker;
			});
			return markers;
		});
	}

	function updateMarker(newMarker) {
		return fetch('/marker/' + newMarker._id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newMarker),
		})
			.then(res => res.json())
			.then(({ marker: updatedMarker, collectionUpdatedAt, message }) => {
				if (message) return alert(message);
				setMarkers(markers => {
					const newMarkers = markers.map(marker =>
						marker._id === newMarker._id ? updatedMarker : marker
					);
					setCollection(collection => ({
						...collection,
						updatedAt: collectionUpdatedAt,
						markers: newMarkers,
					}));
					return newMarkers;
				});
				return { marker: updatedMarker, collectionUpdatedAt };
			});
	}

	function seekRelative(change, moveMarker) {
		if (!player) return;

		setDuration(duration => {
			setCurrentTime(currentTime => {
				const newTime = currentTime + change;
				if (newTime < 0 || newTime > duration) return newTime;
				setActiveMarker(activeMarker => {
					if (!moveMarker) return activeMarker;

					const newActiveMarker = { ...activeMarker, when: newTime };
					updateMarker(newActiveMarker);

					return newActiveMarker;
				});
				player.seekTo(newTime);
				return newTime;
			});
			return duration;
		});
	}

	function toggleMuteState() {
		if (!player) return;

		if (player.isMuted()) player.unMute();
		else player.mute();
	}

	const [showingKeyboardShortcuts, setShowingKeyboardShortcuts] = useState(false);

	useEffect(() => {
		if (!player) return;

		const listener = async e => {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
			const key = e.key.toUpperCase();
			if (key === 'K' || key === ' ') togglePlayState();
			else if (key === 'W' || (e.ctrlKey && key === 'ARROWLEFT')) seekRelativeMarker(-1);
			else if (key === 'S' || (e.ctrlKey && key === 'ARROWRIGHT')) seekRelativeMarker(1);
			else if (key === 'J') seekRelative(-10, e.shiftKey);
			else if (key === 'L') seekRelative(10, e.shiftKey);
			else if (key === 'ARROWLEFT') seekRelative(-5, e.shiftKey);
			else if (key === 'ARROWRIGHT') seekRelative(5, e.shiftKey);
			else if (key === ',') seekRelative(-(1 / 30), e.shiftKey);
			else if (key === '.') seekRelative(1 / 30, e.shiftKey);
			else if (key === 'Q') seekRelative(-1, e.shiftKey);
			else if (key === 'E') seekRelative(1, e.shiftKey);
			else if (key === 'B') document.querySelector('#add-marker-button').click();
			else if (key === 'N' || key === 'T')
				setActiveMarker(activeMarker => {
					setSelectedMarker(activeMarker);
					return activeMarker;
				});
			else if (key === 'M') toggleMuteState();
			else if (e.shiftKey && key === '?') setShowingKeyboardShortcuts(true);
			else return; // Not a key we care about
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
		};
		window.addEventListener('keydown', listener);
		return () => window.removeEventListener('keydown', listener);
	}, [player]);

	const markerPlaces = useMemo(
		() => secondsToHMS(markers[markers.length - 1]?.when ?? 0).split(':').length,
		[markers]
	);

	const markersAsText = useMemo(() => {
		const lines = [];
		for (const marker of markers) {
			const dhms = secondsToHMS(marker.when, undefined, markerPlaces);
			const values = [dhms, marker.title];
			if (marker.description) values.push(marker.description);
			lines.push(values.filter(Boolean).join('\t'));
		}
		return lines.join('\n');
	}, [markers, markerPlaces]);

	const totalPlaces = useMemo(() => secondsToHMS(duration).split(':').length, [duration]);

	const encodedCollection = useMemo(
		() =>
			`${window.location.origin}/v/${encodeURIComponent(entityId)}/${base64encode(
				JSON.stringify({
					_id: Date.now(),
					entity: { _id: entityId, type, title: entity.title },
					title,
					description,
					markers: markers.map(({ when, title, description }, i) => ({
						_id: i,
						when,
						title,
						description: description || undefined,
					})),
					public: isPublic,
				})
			)}`,
		[entityId, type, entity, title, description, markers, isPublic]
	);

	const markersAsCommentText = useMemo(() => {
		const lines = [];
		for (const marker of markers) {
			const dhms = secondsToHMS(marker.when, undefined, markerPlaces);
			const values = [dhms, marker.title];
			lines.push(values.filter(Boolean).join('\t'));
		}
		return lines.join('\n');
	}, [markers, markerPlaces]);

	const footer = (
		<div className="flex justify-between mt-2">
			<Modal buttonContent={<i className="fa fa-share" alt="Export" title="Export"></i>}>
				<div className="flex flex-col p-6 rounded shadow-lg cursor-default dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900 w-[75vw]">
					<div>
						<label className="mt-3 text-xs font-semibold">
							Encoded URL
							<button
								className="float-right hover:animate-pulse"
								onClick={() =>
									navigator.clipboard
										.writeText(encodedCollection)
										.then(() => alert('Encoded URL copied to clipboard'))
								}
							>
								<i
									className="fa fa-clipboard"
									alt="Copy Encoded URL to Clipboard"
									title="Copy Encoded URL to Clipboard"
								></i>
							</button>
						</label>
						<a
							href={encodedCollection}
							target="_blank"
							rel="noreferrer"
							className="inline-block hover:animate-pulse w-full underline truncate underline-offset-2 hover:underline-offset-1 hover:animate-pulse"
						>
							{encodedCollection}
						</a>
					</div>
					<div>
						<label className="mt-3 text-xs font-semibold" htmlFor="markersAsCommentText">
							Markers as Text
							<button
								className="float-right hover:animate-pulse"
								onClick={() =>
									navigator.clipboard
										.writeText(document.querySelector('#markersAsCommentText').value)
										.then(() => alert('Markers Text copied to clipboard'))
								}
							>
								<i
									className="fa fa-clipboard"
									alt="Export as Textual Comment"
									title="Export as Text"
								></i>
							</button>
						</label>
						<textarea
							className="flex items-center w-full px-4 mt-2 bg-gray-200 rounded dark:bg-gray-800 focus:outline-none focus:ring-2"
							id="markersAsCommentText"
							defaultValue={markersAsCommentText}
							rows={5}
						/>
					</div>
				</div>
			</Modal>
			<button className="hover:animate-pulse" onClick={() => setShowingKeyboardShortcuts(true)}>
				<i className="fa fa-keyboard-o" alt="Keyboard Shortcuts" title="Keyboard Shortcuts"></i>
			</button>
			{user ? (
				<button
					className="hover:animate-pulse"
					onClick={() => {
						const url = new URL(window.location.origin + '/v');
						url.searchParams.set('entity', entityId);
						url.searchParams.set('public', isPublic);
						url.searchParams.set('type', type);
						url.searchParams.set('title', title + ' (Copy)');
						url.searchParams.set('description', description);
						url.searchParams.set('markers', markersAsText);
						window.location.href = url.toString();
					}}
				>
					<i className="fa fa-files-o" alt="Clone Collection" title="Clone Collection"></i>
				</button>
			) : null}
		</div>
	);

	const authorInfo = (
		<h2 className="pt-3 text-xl text-center">
			{!isPublic ? <i className="pr-1 fa fa-lock" alt="Private" title="Private"></i> : null}
			{title}
			{author ? (
				<>
					{' by '}
					<a
						className="underline underline-offset-2 hover:underline-offset-1 hover:animate-pulse"
						href={`/profile/${author.username}`}
					>
						{author.username}
					</a>
				</>
			) : null}
		</h2>
	);

	return (
		<section className={`flex ${columnCount === 1 ? 'flex-col' : 'flex-row'}`}>
			{showingKeyboardShortcuts ? (
				<Modal defaultOpen={true} onClose={() => setShowingKeyboardShortcuts(false)}>
					<div className="flex flex-col p-6 rounded shadow-lg cursor-default dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900">
						<h2 className="text-lg text-center">Keyboard Shortcuts</h2>
						<table className="mt-4 border-spacing-4">
							<thead>
								<tr>
									<th>Key</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries({
									'K / Space': 'Pause/Play',
									'S / Ctrl + Left Arrow': 'Seek to next marker',
									'W / Ctrl + Right Arrow': 'Seek to previous marker',
									J: 'Seek back 10 seconds',
									L: 'Seek forward 10 seconds',
									'Left Arrow': 'Seek back 5 seconds',
									'Right Arrow': 'Seek forward 5 seconds',
									',': 'Seek back 1 frame',
									'.': 'Seek forward 1 frame',
									Q: 'Seek back 1 second',
									E: 'Seek forward 1 second',
									B: 'Add marker at current time',
									N: 'Edit marker title',
									T: 'Edit marker time',
									U: 'Open menu',
									'Shift + ?': 'Show this dialog',
									'': '',
									'Holding Shift + Any seek key': 'Seek & update current marker',
								}).map(([key, value]) => (
									<tr key={key}>
										<td className="font-mono pr-2">{key}</td>
										<td>{value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Modal>
			) : null}
			<div>
				<div>
					<button
						className="absolute left-1"
						onClick={() => setColumns(count => (count === 1 ? 2 : 1))}
					>
						<i className="fa fa-columns" alt="Toggle Column View" title="Toggle Column View"></i>
					</button>
					<h1 className="pt-3 text-xl text-center">
						<a
							className="underline underline-offset-2 hover:underline-offset-1 hover:animate-pulse"
							href={`/v/${encodeURIComponent(entity._id)}`}
						>
							{entity.title}
						</a>
					</h1>

					{columnCount === 1 ? authorInfo : null}

					{description ? <div dangerouslySetInnerHTML={{ __html: description }}></div> : null}
				</div>
				<div className="flex flex-col">
					{canEdit ? (
						<div className="flex justify-between">
							<Modal buttonContent={<i className="fa fa-edit" alt="Update" title="Update"></i>}>
								<form
									className="flex flex-col p-6 rounded shadow-lg cursor-default dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900"
									method="POST"
								>
									<input type="hidden" name="_method" value="PATCH" />
									<label className="text-xs font-semibold" htmlFor="entity">
										Video ID/URL
									</label>
									<input
										className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
										type="text"
										name="entity"
										id="entity"
										defaultValue={entityId}
									/>
									<label className="text-xs font-semibold" htmlFor="title">
										Title
									</label>
									<input
										className="flex items-center h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded min-w-[12rem] md:min-w-[16rem] focus:outline-none focus:ring-2"
										type="text"
										name="title"
										id="title"
										defaultValue={title}
									/>
									<div className="flex justify-between mt-3">
										<label htmlFor="public">
											<span className="text-xs font-semibold">Public</span>
										</label>
										<label className="relative flex items-center cursor-pointer select-none w-max">
											<input
												type="checkbox"
												id="public"
												defaultChecked={isPublic}
												name="public"
												className="transition-colors bg-red-500 rounded-full appearance-none cursor-pointer toggle-checkbox w-14 h-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
											/>
											<span className="absolute text-xs font-medium text-white uppercase right-1">
												No
											</span>
											<span className="absolute text-xs font-medium text-white uppercase right-8">
												Yes
											</span>
											<span className="absolute transition-transform transform bg-gray-200 rounded-full dark:bg-gray-800 dark:bg-gray-700 w-7 h-7 right-7"></span>
										</label>
									</div>
									<div className="flex justify-between gap-2 mt-3">
										<span className="flex items-center text-xs font-semibold">Type</span>
										<div className="flex items-center justify-center">
											<div className="inline-flex" role="group">
												<span>
													<input
														name="type"
														type="radio"
														hidden
														required
														{...(entity.type === 'YouTube' ? { defaultChecked: true } : {})}
														value="YouTube"
														id="type-youtube"
														className="peer"
													/>
													<label
														htmlFor="type-youtube"
														className="p-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border-2 rounded-l text-gray-300/50 border-gray-300/50 peer-checked:border-red-600 peer-checked:text-red-600 hover:bg-opacity-5 focus:outline-none focus:ring-0"
													>
														<svg
															viewBox="0 0 28.5 20"
															preserveAspectRatio="xMidYMid meet"
															className="inline w-5 h-5"
															alt="YouTube"
															title="YouTube"
														>
															<g preserveAspectRatio="xMidYMid meet">
																<path
																	d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
																	fill="currentColor"
																></path>
																<path
																	d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
																	fill="white"
																></path>
															</g>
														</svg>
													</label>
												</span>
												<span>
													<input
														name="type"
														type="radio"
														hidden
														required
														{...(entity.type === 'Twitch' ? { defaultChecked: true } : {})}
														value="Twitch"
														id="type-twitch"
														className="peer"
													/>
													<label
														htmlFor="type-twitch"
														className="p-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border-2 text-gray-300/50 border-gray-300/50 peer-checked:border-[#A970FF] hover:bg-opacity-5 focus:outline-none focus:ring-0 peer-checked:text-[#A970FF]"
													>
														<svg
															overflow="visible"
															width="40px"
															height="40px"
															version="1.1"
															viewBox="0 0 40 40"
															x="0px"
															y="0px"
															className="inline w-5 h-5"
														>
															<g>
																<polygon
																	points="13 8 8 13 8 31 14 31 14 36 19 31 23 31 32 22 32 8"
																	fill="currentColor"
																></polygon>
																<polygon
																	points="26 25 30 21 30 10 14 10 14 25 18 25 18 29 22 25"
																	fill="white"
																></polygon>
															</g>
															<g>
																<path
																	d="M20,14 L22,14 L22,20 L20,20 L20,14 Z M27,14 L27,20 L25,20 L25,14 L27,14 Z"
																	fill="currentColor"
																></path>
															</g>
														</svg>
													</label>
												</span>
												<span>
													<input
														name="type"
														type="radio"
														hidden
														required
														{...(entity.type === 'File' ? { defaultChecked: true } : {})}
														value="File"
														id="type-file"
														className="peer"
													/>
													<label
														htmlFor="type-file"
														className="p-2 text-xs font-medium leading-tight uppercase transition duration-150 ease-in-out border-2 rounded-r text-gray-300/50 border-gray-300/50 peer-checked:border-green-600 peer-checked:text-green-600 hover:bg-opacity-5 focus:outline-none focus:ring-0"
													>
														<i className="fa fa-file-video-o" alt="File" title="File"></i>
													</label>
												</span>
											</div>
										</div>
									</div>
									<label className="mt-3 text-xs font-semibold" htmlFor="description">
										Description
										<img
											src="https://www.markdownguide.org/favicon.ico"
											alt="Markdown Compatible"
											title="Markdown Compatible"
											className="inline-block pl-1 invert dark:invert"
										/>
									</label>
									<textarea
										className="flex items-center h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded min-w-[12rem] md:min-w-[16rem] focus:outline-none focus:ring-2"
										name="description"
										id="description"
										defaultValue={description}
									/>
									<label className="mt-3 text-xs font-semibold" htmlFor="markers">
										Markers (H:M:S Title Description)
									</label>
									<textarea
										className="flex items-center min-w-[12rem] pr-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] lg:w-80 focus:outline-none focus:ring-2"
										name="markers"
										id="markers"
										defaultValue={markersAsText}
										rows={5}
									/>

									<div className="flex justify-center gap-2 text-xs">
										<button
											className="flex hover:animate-pulse items-center justify-center min-w-[12rem] h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded md:min-w-[16rem] hover:bg-blue-700"
											type="submit"
										>
											Update
										</button>
									</div>
								</form>
							</Modal>
							<Modal buttonContent={<i className="fa fa-trash" alt="Delete" title="Delete"></i>}>
								<form
									className="flex flex-col p-6 rounded shadow-lg cursor-default dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900"
									method="POST"
								>
									<input type="hidden" name="_method" value="DELETE" />
									<h2 className="text-lg">
										Are you SURE you want to delete the collection &quot;{title}
										&quot; with {markers.length} markers?
									</h2>
									<div className="flex justify-center gap-2 text-xs">
										<button
											className="flex hover:animate-pulse items-center justify-center min-w-[12rem] h-12 px-6 mt-8 text-sm font-semibold text-red-100 bg-red-600 rounded md:min-w-[16rem] hover:bg-red-700"
											type="submit"
										>
											Delete
										</button>
									</div>
								</form>
							</Modal>
						</div>
					) : null}
					<div className="flex items-center justify-center">
						<div id="player-embed"></div>
					</div>

					<div className="flex flex-row justify-between mt-2">
						<span className="font-mono">
							<time dateTime={secondsToHMS(currentTime)}>
								{secondsToHMS(currentTime, undefined, totalPlaces)}
							</time>
							{' / '}
							<time dateTime={'PT' + secondsToHMS(duration, 'HMS')}>{secondsToHMS(duration)}</time>
						</span>
						{activeMarker ? (
							<span
								onClick={e => {
									e.preventDefault();
									player.seekTo(activeMarker.when);
								}}
								onContextMenu={e => {
									e.preventDefault();
									setSelectedMarker(activeMarker);
								}}
								className="truncate max-w-[50vmin]"
							>
								{activeMarker?.title}
							</span>
						) : null}

						{canEdit ? (
							<Modal
								buttonContent={
									<i
										className="fa fa-plus"
										alt="Add Marker"
										title="Add Marker"
										id="add-marker-button"
										onClick={() => setAddingAt(currentTime)}
									/>
								}
								onClose={() => setAddingAt(null)}
							>
								<form
									className="flex flex-col p-6 rounded shadow-lg cursor-default dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900"
									onSubmit={e => {
										e.preventDefault();
										const formData = new FormData(e.target);
										const whenHMS = formData.get('when');
										const [hours, minutes, seconds] = whenHMS.split(':');
										const when = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0) * 1;
										const marker = {
											collectionRef: _id,
											when,
											title: formData.get('title'),
											description: formData.get('description'),
										};
										return fetch('/marker', {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify(marker),
										})
											.then(res => res.json())
											.then(({ markerId, collectionUpdatedAt, message }) => {
												if (message) return alert(message);
												marker._id = markerId;
												setMarkers(markers => {
													const newMarkers = [...markers, marker].sort((a, b) => a.when - b.when);
													setCollection(collection => ({
														...collection,
														updatedAt: collectionUpdatedAt,
														markers: newMarkers,
													}));
													return newMarkers;
												});
												e.target.closest('[data-test-id="modal-backdrop"]').click();
												setAddingAt(null);
											});
									}}
								>
									<label className="text-xs font-semibold" htmlFor="title">
										Title
									</label>
									<input
										className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
										type="text"
										name="title"
										id="title"
									/>
									<label className="mt-3 text-xs font-semibold" htmlFor="title">
										When
									</label>
									<HMSInput
										defaultValue={addingAt}
										id="when"
										name="when"
										onValueChange={newValue => setAddingAt(newValue)}
									/>
									<label className="mt-3 text-xs font-semibold" htmlFor="description">
										Description
										<img
											src="https://www.markdownguide.org/favicon.ico"
											alt="Markdown Compatible"
											title="Markdown Compatible"
											className="inline-block pl-1 dark:invert"
										/>
									</label>
									<textarea
										className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
										name="description"
										id="description"
									/>

									<div className="flex justify-center gap-2 text-xs">
										<button
											className="flex hover:animate-pulse items-center justify-center min-w-[12rem] h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded md:min-w-[16rem] hover:bg-blue-700"
											type="submit"
										>
											Create
										</button>
									</div>
								</form>
							</Modal>
						) : null}
					</div>

					<div className="flex flex-row justify-between gap-1">
						<div className="flex gap-1">
							<time
								dateTime={createdAt}
								alt={`Collection created at ${createdAt}`}
								title={`Collection created at ${createdAt}`}
							>
								<i className="fa fa-calendar-o"></i>
							</time>
							{updatedAt !== createdAt && (
								<time
									dateTime={updatedAt}
									alt={`Collection updated at ${updatedAt}`}
									title={`Collection updated at ${updatedAt}`}
								>
									<i className="fa fa-calendar"></i>
								</time>
							)}
						</div>
						{entity.createdAt ? (
							<time
								dateTime={entity.createdAt}
								alt={`Entity created at ${entity.createdAt}`}
								title={`Entity created at ${entity.createdAt}`}
							>
								<i className="fa fa-calendar-o"></i>
							</time>
						) : null}
					</div>

					{columnCount === 2 ? footer : null}
				</div>
			</div>
			{selectedMarker ? (
				<Modal defaultOpen={true} onClose={() => setSelectedMarker(null)}>
					<form
						className="flex flex-col p-6 rounded shadow-lg cursor-default dark:shadow-slate-600 bg-slate-50 dark:bg-slate-900"
						onSubmit={e => {
							e.preventDefault();
							if (
								document.activeElement.tagName === 'BUTTON' &&
								document.activeElement.value === 'delete'
							) {
								return fetch('/marker/' + selectedMarker._id, {
									method: 'DELETE',
								})
									.then(res => res.json())
									.then(({ collectionUpdatedAt, message }) => {
										if (message) return alert(message);

										setMarkers(markers => {
											const newMarkers = markers.filter(
												marker => marker._id !== selectedMarker._id
											);
											setCollection(collection => ({
												...collection,
												updatedAt: collectionUpdatedAt,
												markers: newMarkers,
											}));
											return newMarkers;
										});
										setSelectedMarker(null);
									});
							}
							const formData = new FormData(e.target);
							const whenHMS = formData.get('when');
							const [hours, minutes, seconds] = whenHMS.split(':');
							const when = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0) * 1;
							const newMarker = {
								...selectedMarker,
								title: formData.get('title'),
								description: formData.get('description'),
								when,
							};
							return updateMarker(newMarker).then(({ marker: updatedMarker }) => {
								setSelectedMarker(updatedMarker);
								e.target.closest('[data-test-id="modal-backdrop"]').click();
							});
						}}
					>
						<label className="text-xs font-semibold" htmlFor="title">
							Title
						</label>
						<input
							className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
							type="text"
							name="title"
							id="title"
							defaultValue={selectedMarker.title}
							autoFocus
						/>
						<label className="mt-3 text-xs font-semibold" htmlFor="title">
							When
						</label>
						<HMSInput defaultValue={selectedMarker.when} id="when" name="when" />
						<label className="mt-3 text-xs font-semibold" htmlFor="description">
							Description
							<img
								src="https://www.markdownguide.org/favicon.ico"
								alt="Markdown Compatible"
								title="Markdown Compatible"
								className="inline-block pl-1 dark:invert"
							/>
						</label>
						<textarea
							className="flex items-center min-w-[12rem] h-12 px-4 mt-2 bg-gray-200 dark:bg-gray-800 rounded md:min-w-[16rem] focus:outline-none focus:ring-2"
							name="description"
							id="description"
							defaultValue={selectedMarker.description}
						/>

						<div className="flex justify-center gap-2 text-xs">
							<button
								className="flex hover:animate-pulse items-center justify-center w-24 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded md:w-32 hover:bg-blue-700"
								type="submit"
							>
								Update
							</button>
							<button
								className="flex hover:animate-pulse items-center justify-center w-24 h-12 px-6 mt-8 text-sm font-semibold text-red-100 bg-red-600 rounded md:w-32 hover:bg-red-700"
								value="delete"
							>
								Delete
							</button>
						</div>
					</form>
				</Modal>
			) : null}
			<ul
				className={`border border-slate-900 scroll-smooth ${
					columnCount === 2 ? 'ml-1 h-[85vh] overflow-y-scroll' : ''
				}`}
			>
				{columnCount === 2 ? <li>{authorInfo}</li> : null}
				{markers.map(marker => (
					<li key={marker._id}>
						<button
							className={`w-full flex group justify-between p-2 border-b border-gray-800 dark:border-gray-200 cursor-pointer hover:bg-gray-500 hover:text-black ${
								activeMarker?._id === marker._id
									? 'bg-slate-900 text-slate-200 dark:bg-slate-700 dark:text-slate-400'
									: ''
							}`}
							data-active-marker={activeMarker?._id === marker._id}
							onClick={e => {
								e.preventDefault();
								player?.seekTo(marker.when);
							}}
							onContextMenu={
								canEdit
									? e => {
										e.preventDefault();
										setSelectedMarker(marker);
									  }
									: undefined
							}
						>
							<span className="text-left mr-2">{marker.title}</span>
							<div className="font-mono text-right flex items-center">
								<time dateTime={secondsToHMS(marker.when)}>
									{secondsToHMS(marker.when, undefined, markerPlaces)}
								</time>

								{canEdit ? (
									<button
										className="invisible pl-1 hoverless:visible group-hover:visible hover:animate-pulse"
										onClick={e => {
											e.stopPropagation();
											setSelectedMarker(marker);
										}}
									>
										<i className="fa fa-gear" />
									</button>
								) : null}
							</div>
						</button>
					</li>
				))}
			</ul>

			{columnCount === 1 ? footer : null}
		</section>
	);
}
