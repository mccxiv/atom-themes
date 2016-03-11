import request from 'request-promise';
import cheerio from 'cheerio';
import EventEmitter from 'events';

function getDom(uri, qs = {}) {
  return request({uri, qs, transform: (body) => cheerio.load(body)});
}

async function getThemeFromName(name) {
  const $ = await getDom(`https://atom.io/themes/${name}`);
  const f = $().find.bind($('.package-card')); // Awkward
  const description = txt(f('.card-name'));
  const downloads = txt(f('[aria-label="Downloads"]')).replace(',', '');
  const stars = txt(f('.package-card .social-count'));
  const images = $('.readme img').map((i, el) =>
    $(el).attr('data-canonical-src')
  ).get();

  return {name, description, downloads, stars, images};

  function txt($el) {return $el.text().trim();}
}

async function getNamesFromPage(page, sort = 'downloads') {
  const url = 'https://atom.io/themes/list';
  const query = {direction: 'desc', page, sort};
  const $ = await getDom(url, query);
  return $('.card .card-name').map((i, el) => $(el).text().trim()).get();
}

async function getAllNames() {
  return gather();

  async function gather(count = 1, allNames = []) {
    const names = await getNamesFromPage(count);
    if (names.length) return gather(count + 1, allNames.concat(names));
    else return allNames;
  }
}

function getThemesFromNames(names) {
  const ee = new EventEmitter();
  sequential(names.slice());
  return ee;

  async function sequential(toFetch) {
    if (toFetch.length) {
      const theme = await getThemeFromName(toFetch[0]);
      ee.emit('theme', theme);
      toFetch.shift();
      sequential(toFetch);
    }
    else setTimeout(() => ee.emit('done'), 0);
  }
}

export {
  getThemeFromName,
  getNamesFromPage,
  getAllNames,
  getThemesFromNames
};
