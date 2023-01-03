import Collection from './Collection.js'

const script = [...document.scripts].find(script => script.src === import.meta.url);
const collection = JSON.parse(script.dataset.collection);
const user = JSON.parse(script.dataset.user || 'null');

ReactDOM.createRoot(document.getElementById('root')).render(<Collection collection={collection} user={user} />);