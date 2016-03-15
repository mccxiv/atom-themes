# Yay, it's the atom-themes library!
Obtain info on the available themes for the Atom editor.

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
`options.readme`: Boolean. Whether or not to grab the repo's readme. Requires more requests.

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

Sample output:
```js
// themes.get('monokai')

{
  "name": "monokai",
  "repo": "https://github.com/kevinsawicki/monokai",
  "author": {
    "name": "kevinsawicki",
    "image": "https://github.com/kevinsawicki.png"
  },
  "description": "monokai",
  "downloads": "329933",
  "stars": "657",
  "images": [
    {
      "url": "https://f.cloud.github.com/assets/671378/2265671/d02ebee8-9e85-11e3-9b8c-12b2cb7015e3.png"
    }
  ]
}

```

With options:  
- `readme: true` - Include the repository's readme. Requires extra API call.
- `images: true` - Include image metadata such as size and colors.
  - Causes extra network requests.
  - Detects if the theme is dark or light.
  - The image palette is made of 6-10 colors.


```js
// themes.get('monokai', {readme: true, images: true})

{
  "name": "monokai",
  "repo": "https://github.com/kevinsawicki/monokai",
  "author": {
    "name": "kevinsawicki",
    "image": "https://github.com/kevinsawicki.png"
  },
  "description": "monokai",
  "downloads": "329935",
  "stars": "657",
  "images": [
    {
      "url": "https://f.cloud.github.com/assets/671378/2265671/d02ebee8-9e85-11e3-9b8c-12b2cb7015e3.png",
      "dimensions": {
        "width": 1414,
        "height": 1002
      },
      "background": {
        "isDark": true,
        "color": {
          "r": 37,
          "g": 45,
          "b": 37
        }
      },
      "palette": [
        {
          "r": 37,
          "g": 45,
          "b": 37
        },
        {
          "r": 219,
          "g": 197,
          "b": 177
        },
        {
          "r": 100,
          "g": 206,
          "b": 209
        },
        {
          "r": 114,
          "g": 120,
          "b": 106
        },
        {
          "r": 105,
          "g": 117,
          "b": 165
        },
        {
          "r": 103,
          "g": 67,
          "b": 65
        },
        {
          "r": 72,
          "g": 75,
          "b": 98
        }
      ]
    }
  ],
  "readme": "# Monokai theme\n\nA monokai syntax theme for Atom.\n\nOriginally converted from the [TextMate](http://www.monokai.nl/blog/wp-content/asdev/Monokai.tmTheme)\ntheme using the [TextMate bundle converter](http://atom.io/docs/latest/converting-a-text-mate-theme).\n\n![](https://f.cloud.github.com/assets/671378/2265671/d02ebee8-9e85-11e3-9b8c-12b2cb7015e3.png)\n"
}

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

---

© 2016 Andrea Stella, ISC license.