# Yay, it's the atom-themes library!
Obtain info on the available themes for the Atom editor.

## Todo
- [x] Add sorting options
- [ ] Add option to grab readme (requires extra GitHub request)

## ⚛ Installation
Download: ``` npm i --save atom-themes ```
```
const themes = require('atom-themes');
```

*Browser version?* -  Nope. We can't scrape cross domain

---

## ⚛ The .get method
```
themes.get(input, options);
```
`input`: Number, string or array. Check below for explanations.  
`options`: Optional configuration object. Sorting only has an effect when fetching pages.  
`options.sort`: One of `'downloads'`, `'stars'`, `'created_at'`, or `'updated_at'`.  
`options.direction`: The sorting direction, defaults to `'desc'`.

### Fetch theme names on a specific page
```js
themes.get(3).then((names) => console.log(names));
```
In the example above, we obtain an array of theme names from the third page of [atom.io/themes](https://atom.io/themes/).   
**How many pages are there?** We don't know, you can keep calling this until you receive an empty array. Then you'll know there are no more pages.

### Fetch a theme
```js
themes.get('monokai').then((theme) => console.log(theme));
```
The promise will return an object with the theme's metadata.  
Sample output:
```js
{ name: 'monokai',
  author:
   { name: 'kevinsawicki',
     picture: 'https://github.com/kevinsawicki.png' },
  version: '0.18.0',
  description: 'monokai',
  downloads: '329124',
  stars: '657',
  images: [ 'https://f.cloud.github.com/assets/671378/2265671/d02ebee8-9e85-11e3-9b8c-12b2cb7015e3.png' ] }
```

---

## ⚛ Other helpers

### Fetch a list of themes
```js
const fetcher = themes.get(['monokai', 'seti-ui']);

fetcher.on('theme', (theme) => console.log(theme));
fetcher.on('done', () => console.log('Finished fetching.'));
```
Passing an array will return an event emitter object. Listen to its `theme` and `done` events. The `theme` event will fire for each fetched theme object.  
Objects will be fetched sequentially, not in parallel.  
The order in which the events fire is predictable.  
For long lists such as fetching the entire database, this operation will obviously take a long time.