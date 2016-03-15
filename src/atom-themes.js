import request from 'request-promise';
import cheerio from 'cheerio';
import Jimp from 'jimp';
import ColorThief from 'color-thief-jimp';
import TinyColor from 'tinycolor2';
import EventEmitter from 'events';

function getDom(uri, qs = {}) {
  return request({uri, qs, transform: (body) => cheerio.load(body)});
}

async function getReadme(owner, repo) {
  const uri = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const headers = {'User-Agent': 'request-promise'};
  const readmeMeta = await request({uri, headers, json: true});
  return request({uri: readmeMeta.download_url, headers});
}

async function getImageMeta({url}) {
  const img = await Jimp.read(url);
  const rgb = ColorThief.getColor(img);
  const palette = ColorThief.getPalette(img, 8);
  const rgbObject = {r: rgb[0], g: rgb[1], b: rgb[2]};
  return {
    url,
    dimensions: {
      width: img.bitmap.width,
      height: img.bitmap.height
    },
    background: {
      isDark: TinyColor(rgbObject).isDark(),
      color: rgbObject
    },
    palette: palette.map((rgb) => {return {r: rgb[0], g: rgb[1], b: rgb[2]}})
  }
}

async function getThemeFromName(name, opts = {}) {
  const $ = await getDom(`https://atom.io/themes/${name}`);
  const f = $().find.bind($('.card')); // Awkward
  const theme = {
    name,
    repo: $('.package-meta li:first-child a').attr('href'),
    author: {
      name: txt(f('.author')),
      image: f('img.gravatar').attr('src')
    },
    description: txt(f('.card-name')),
    downloads: txt(f('[aria-label*="ownload"]')).replace(',', ''),
    stars: txt(f('.package-card .social-count')),
    images: $('.readme img').map((i, el) =>
      $(el).attr('data-canonical-src')
    ).get().map((url) => {return {url: url}})
  };

  if (opts.readme) theme.readme = await getReadme(theme.author.name, name);
  if (opts.images) {
    theme.images = await Promise.all(theme.images.map(getImageMeta));
  }
  return theme;

  function txt($el) {return $el.text().trim();}
}

async function getNamesFromPage(page, {sort, direction} = {}) {
  // Can't have multiple default properties inside of parameter object :(
  sort = sort || 'downloads';
  direction = direction || 'desc';
  console.log(sort, direction);
  const url = 'https://atom.io/themes/list';
  const query = {page, sort, direction};
  const $ = await getDom(url, query);
  return $('.card .card-name').map((i, el) => $(el).text().trim()).get();
}

function getThemesFromNames(names, opts) {
  const ee = new EventEmitter();
  sequential(names.slice());
  return ee;

  async function sequential(toFetch) {
    if (toFetch.length) {
      const theme = await getThemeFromName(toFetch[0], opts);
      ee.emit('theme', theme);
      toFetch.shift();
      sequential(toFetch);
    }
    else setTimeout(() => ee.emit('done'), 0);
  }
}

function get(input, opts) {
  if (typeof input === 'number') return getNamesFromPage(input, opts);
  if (typeof input === 'string') return getThemeFromName(input, opts);
  if (Array.isArray(input)) return getThemesFromNames(input, opts);
  else throw Error('Invalid parameter for atom-themes .get()');
}

export {get};
