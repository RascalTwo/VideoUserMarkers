import App from './App.js';

const script = [...document.scripts].find(script => script.src === import.meta.url);
const collection = JSON.parse(script.dataset.collection);
const user = JSON.parse(script.dataset.user || 'null');
const isEmbed = script.dataset.isEmbed === 'true';

ReactDOM.createRoot(document.getElementById('root')).render(
	<App initialCollection={collection} user={user} isEmbed={isEmbed} />
);
