import request from 'request-promise';
import cheerio from 'cheerio';
import Jimp from 'jimp';
import ColorThief from 'color-thief-jimp';
import TinyColor from 'tinycolor2';

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
  try {var img = await Jimp.read(url);}
  catch(e) {return arguments[0]}

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

async function getPackageDotJson(user, repo) {
  const domain = 'https://raw.githubusercontent.com';
  const json = await request.get({
    url: `${domain}/${user}/${repo}/master/package.json`,
    json: true
  });
  
  delete json.readme;
  Object.keys(json).forEach((key) => {
    if (key.split('').shift() === '_') delete json[key];
  });
  return json;
}

function getRepoUrlSection(url, section) {
  const arr = url.split('');
  if (arr[arr.length-1] === '/') arr.pop();
  const repoUrl = arr.join('');
  const sections = repoUrl.split('/');
  if (section === 'user') return sections[sections.length-2];
  if (section === 'repo') return sections.pop();
}

async function getThemeFromName(name, opts = {}) {
  const $ = await getDom(`https://atom.io/themes/${name}`);
  const f = $().find.bind($('.card')); // Awkward
  const repoUrl = $('.package-meta li:first-child a').attr('href');
  const ghUser = getRepoUrlSection(repoUrl, 'user');
  const ghRepo = getRepoUrlSection(repoUrl, 'repo');
  const theme = {
    name,
    author: {
      name: txt(f('.author')),
      image: f('img.gravatar').attr('src'),
      url: 'https://atom.io' + f('.author').attr('href')
    },
    repo: repoUrl,
    downloads: Number(txt(f('[aria-label*="ownload"]')).replace(',', '')),
    stars: Number(txt(f('.package-card .social-count'))),
    package: 'placeholder',
    images: $('.readme img').map((i, el) =>
      $(el).attr('data-canonical-src')
    ).get().map((url) => {return {url: url}})
  };

  if (opts.package) theme.package = await getPackageDotJson(ghUser, ghRepo);
  else delete theme.package;
  if (opts.readme) theme.readme = await getReadme(ghUser, ghRepo);
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

function get(input, opts) {
  if (typeof input === 'number') return getNamesFromPage(input, opts);
  if (typeof input === 'string') return getThemeFromName(input, opts);
  else throw Error('Invalid parameter for atom-themes .get()');
}

export {get};
