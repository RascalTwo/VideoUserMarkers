import Modal from './Modal.js';
import HMSInput from './HMSInput.js';

const { useEffect, useState } = React


function secondsToHMS(seconds) {
	var h = Math.floor(seconds / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 3600 % 60);
	return (
		(h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") +
		m +
		":" +
		(s < 10 ? "0" : "") +
		s
	);
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

	seekTo(seconds) {
		throw new Error('Not implemented');
	}

	setDimensions(width, height) {
		throw new Error('Not implemented');
	}

	onPlay(callback) {
		throw new Error('Not implemented');
	}

}

class TwitchPlayer extends Player {
	constructor(videoId) {
		super(videoId);
		this.player = new Twitch.Player("player-embed", {
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

	onPlay(callback) {
		this.player.addEventListener(Twitch.Player.PLAY, callback);
	}
}

class YouTubePlayer extends Player {
	constructor(videoId) {
		super(videoId);
		this.player = new YT.Player("player-embed", {
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

	onPlay(callback) {
		this.player.addEventListener('onStateChange', event => {
			if (event.data === YT.PlayerState.PLAYING) callback();
		});
	}
}

export default function Collection({ collection: { _id, entity: { _id: entityId, type }, title, description, markers: initialMarkers }, user }) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (ready) return;
		if (type === 'Twitch') return setReady(true)
		window.onYouTubeIframeAPIReady = () => setReady(true);
		const tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";

		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}, [ready, entityId, type]);

	const [markers, setMarkers] = useState(initialMarkers.sort((a, b) => a.when - b.when));

	const [player, setPlayer] = useState();
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	useEffect(() => {
		if (!ready) return
		const player = type === 'YouTube' ? new YouTubePlayer(entityId) : new TwitchPlayer(entityId);
		player.onPlay(() => setDuration(player.getDuration()));
		setPlayer(player);

		const interval = setInterval(() => setCurrentTime(Math.trunc(player.getCurrentTime())), 100);
		// TODO - clear event listener on unmount
		return () => clearInterval(interval);
	}, [ready, entityId, type])

	useEffect(() => {
		if (!player) return;

		const resizeListener = () => {
			const ratio = window.innerWidth < window.innerHeight ? 0.85 : 0.75;
			const maxWidth = window.innerWidth * ratio;
			player.setDimensions(maxWidth, maxWidth * 9 / 16);
		}
		resizeListener();

		window.addEventListener('resize', resizeListener);
		return () => window.removeEventListener('resize', resizeListener);
	}, [player]);

	const [addingAt, setAddingAt] = useState(null);

	const [selectedMarker, setSelectedMarker] = useState(null);

	const [activeMarker, setActiveMarker] = useState(null);
	useEffect(() => {
		setActiveMarker([...markers].reverse().find(marker => marker.when <= currentTime) ?? null);
	}, [markers, currentTime]);

	return <>
		{user ? (
			<div className="flex justify-between">
				<Modal buttonContent={<i className="fa fa-edit" alt="Update" title="Update"></i>}>
					<form className="flex flex-col p-6 bg-white rounded shadow-lg cursor-default" method="POST">
						<input type="hidden" name="_method" value="PATCH" />
						<label class="font-semibold text-xs" for="title">
							Title
						</label>
						<input
							class="flex items-center h-12 px-4 w-48 md:w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
							type="text"
							name="title"
							id="title"
							defaultValue={title}
						/>
						<label class="font-semibold text-xs mt-3" for="description">
							Description
						</label>
						<textarea
							class="flex items-center h-12 px-4 w-48 md:w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
							name="description"
							id="description"
							defaultValue={description}
						/>

						<div class="flex justify-center text-xs gap-2">
							<button
								class="flex items-center justify-center h-12 px-6 w-48 md:w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
								type="submit"
							>
								Update
							</button>
						</div>
					</form>
				</Modal>
				<Modal buttonContent={<i className="fa fa-trash" alt="Delete" title="Delete"></i>}>
					<form className="flex flex-col p-6 bg-white rounded shadow-lg cursor-default" method="POST">
						<input type="hidden" name="_method" value="DELETE" />
						<h2 className="text-lg">Are you SURE you want to delete the collection "{title}" with {markers.length} markers?</h2>
						<div class="flex justify-center text-xs gap-2">
							<button
								class="flex items-center justify-center h-12 px-6 w-48 md:w-64 bg-red-600 mt-8 rounded font-semibold text-sm text-red-100 hover:bg-red-700"
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
		<div className="flex justify-between">
			<span className="font-mono">{secondsToHMS(currentTime)} / {secondsToHMS(duration)}</span>
			{activeMarker ? <span onClick={e => {
				e.preventDefault();
				player.seekTo(activeMarker.when);
			}} onContextMenu={e => {
				e.preventDefault();
				setSelectedMarker(activeMarker);
			}} className="truncate max-w-[50vmin]">{activeMarker?.title}</span> : null}

			<Modal buttonContent={<i className="fa fa-plus" alt="Add Marker" title="Add Marker" />}>
				<form className="flex flex-col p-6 bg-white rounded shadow-lg cursor-default" onSubmit={e => {
					e.preventDefault();
					const formData = new FormData(e.target);
					const marker = {
						collectionId: _id,
						when: addingAt,
						title: formData.get('title'),
						description: formData.get('description'),
					}
					return fetch('/marker', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(marker),
					}).then(res => res.json()).then(({ _id, message }) => {
						if (message) return alert(message)
						marker._id = _id;
						setAddingAt(null);
						setMarkers(markers => [...markers, marker].sort((a, b) => a.when - b.when));
						setSelectedMarker(marker);
						e.target.closest('[data-test-id="modal-backdrop"]').click();
					})
				}}>
					<label class="font-semibold text-xs" for="title">
						Title
					</label>
					<input
						class="flex items-center h-12 px-4 w-48 md:w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
						type="text"
						name="title"
						id="title"
					/>
					<label class="font-semibold text-xs mt-3" for="description">
						Description
					</label>
					<textarea
						class="flex items-center h-12 px-4 w-48 md:w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
						name="description"
						id="description"
					/>

					<div class="flex justify-center text-xs gap-2">
						<button
							class="flex items-center justify-center h-12 px-6 w-48 md:w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
							type="submit"
						>
							Create
						</button>
					</div>
				</form>
			</Modal>
		</div>
		{selectedMarker ? <Modal defaultOpen={true} onClose={() => setSelectedMarker(null)}>
			<form className="flex flex-col p-6 bg-white rounded shadow-lg cursor-default" onSubmit={e => {
				e.preventDefault();
				if (document.activeElement.tagName === 'BUTTON' && document.activeElement.value === 'delete') {
					return fetch('/marker/' + selectedMarker._id, {
						method: 'DELETE',
					}).then(res => res.json()).then(({ message }) => {
						if (message) return alert(message)
						setMarkers(markers => markers.filter(marker => marker._id !== selectedMarker._id));
						setSelectedMarker(null);
					})
				}
				const formData = new FormData(e.target);
				const whenHMS = formData.get('when');
				const [hours, minutes, seconds] = whenHMS.split(':');
				const when = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0) * 1;
				const newMarker = {
					...selectedMarker,
					title: formData.get('title'),
					description: formData.get('description'),
					when
				}
				return fetch('/marker/' + selectedMarker._id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newMarker),
				}).then(res => res.json()).then(({ message }) => {
					if (message) return alert(message)
					setMarkers(markers => markers.map(marker => marker._id === selectedMarker._id ? newMarker : marker));
					setSelectedMarker(newMarker);
					e.target.closest('[data-test-id="modal-backdrop"]').click();
				});
			}}>
				<label class="font-semibold text-xs" for="title">
					Title
				</label>
				<input
					class="flex items-center h-12 px-4 w-48 md:w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
					type="text"
					name="title"
					id="title"
					defaultValue={selectedMarker.title}
				/>
				<label class="font-semibold text-xs" for="title">
					When
				</label>
				<HMSInput defaultValue={selectedMarker.when} id="when" name="when" />
				<label class="font-semibold text-xs mt-3" for="description">
					Description
				</label>
				<textarea
					class="flex items-center h-12 px-4 w-48 md:w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2"
					name="description"
					id="description"
					defaultValue={selectedMarker.description}
				/>

				<div class="flex justify-center text-xs gap-2">
					<button
						class="flex items-center justify-center h-12 px-6 w-24 md:w-32 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
						type="submit"
					>
						Update
					</button>
					<button
						class="flex items-center justify-center h-12 px-6 w-24 md:w-32 bg-red-600 mt-8 rounded font-semibold text-sm text-red-100 hover:bg-red-700"
						value="delete"
					>
						Delete
					</button>
				</div>
			</form>
		</Modal> : null}
		<ul className="border border-slate-900">
			{markers.map(marker =>
				<li
					className={`flex justify-between p-2 border-b border-gray-800 cursor-pointer hover:bg-gray-100 hover:text-black ${activeMarker?._id === marker._id ? 'bg-slate-900 text-slate-200' : ''}`}
					key={marker._id}
					onClick={e => {
						e.preventDefault();
						player.seekTo(marker.when);
					}}
					onContextMenu={e => {
						e.preventDefault();
						setSelectedMarker(marker);
					}}
				>
					<span className="text-left">{marker.title}</span>
					<span className="text-right">{secondsToHMS(marker.when)}</span>
				</li>
			)}
		</ul>
	</>
}