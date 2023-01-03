const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const EntitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['YouTube', 'Twitch'],
      required: true,
    },
    rawThumbnail: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: false },
  },
);
EntitySchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'entity',
});
EntitySchema.virtual('thumbnail').get(function () {
  if (this.type === 'YouTube') return `https://img.youtube.com/vi/${this._id}/maxresdefault.jpg`
  return this.rawThumbnail || null;
});
EntitySchema.static('doesEntityExist', async function (id, type) {
  if (type === 'YouTube') {
    const response = await fetch(new this({ _id: id, type }).thumbnail, {
      method: 'OPTIONS',
    });
    return response.status !== 404;
  } else if (type === 'Twitch') {
    const url = new URL(`https://twitch.tv/videos/${id}`);
    const response = await fetch(url);
    const html = await response.text();
    return html.includes('<meta property="og:video"');
  }
  return null;
});
EntitySchema.static('getEntity', async function (id, type) {
  console.log({ id, type })
  const found = await this.findById(id);
  if (found) return found;
  if (!(await this.doesEntityExist(id, type))) return null;
  const entity = await this.create({ _id: id, ...(await this.fetchEntityInfo(id, type)), type });
  return entity;
})
EntitySchema.static('fetchEntityInfo', async function (id, type) {
  if (type === 'YouTube') {
    const url = new URL('https://www.youtube.com/watch');
    url.searchParams.set('v', id);
    const response = await fetch(url.toString());
    const html = await response.text();
    return {
      title: html.split('<meta itemprop="name" content="')[1].split('">')[0],
      createdAt: new Date(html.split('<meta itemprop="datePublished" content="')[1].split('">')[0]),
    };
  } else if (type === 'Twitch') {
    const response = await fetch(`https://www.twitch.tv/videos/${id}`);
    const html = await response.text();
    return {
      title: html.split('data-a-target="stream-title" title="')[1].split('"')[0],
      createdAt: new Date(html.split('<meta property="og:video:release_date" content="')[1].split('">')[0]),
      rawThumbnail: html.split('<meta property="og:image" content="')[1].split('">')[0],
    };
  }
  return null;
});

module.exports = mongoose.model('Entity', EntitySchema);
