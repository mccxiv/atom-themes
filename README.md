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
`options`: Optional configuration object. Available options depend on the type of input.  


### Fetch theme names on a specific page
```js
themes.get(3, opts).then((names) => console.log(names));
```
With options:  
  - `sort`: One of `'downloads'`, `'stars'`, `'created_at'`, or `'updated_at'`. Default is `'downloads'`
  - `direction`: One of `'desc'` or `'asc'`. Default is `'desc'`.

In the example above, we obtain an array of theme names from the third page of [atom.io/themes](https://atom.io/themes/).   
**How many pages are there?** We don't know, you can keep calling this until you receive an empty array. Then you'll know there are no more pages.

### Fetch a theme by name
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
  "downloads": 329933,
  "stars": 657,
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
  - Detects if the image's background is dark or light.
  - The image palette contains 6-10 colors.
  - :warning: Only supported filetypes will have metadata. (No metadata for svg, gif, etc...)


```js
// themes.get('monokai', {readme: true, images: true})

{
  "name": "seti-ui",
  "repo": "https://github.com/jesseweed/seti-ui",
  "author": {
    "name": "jesseweed",
    "image": "https://github.com/jesseweed.png"
  },
  "description": "seti-ui",
  "downloads": 298692,
  "stars": 980,
  "images": [
    {
      "url": "https://badges.gitter.im/Join%20Chat.svg"
    },
    {
      "url": "https://github.com/jesseweed/seti-ui/raw/master/screenshot.png",
      "dimensions": {
        "width": 881,
        "height": 852
      },
      "background": {
        "isDark": true,
        "color": {"r": 20, "g": 21, "b": 26}
      },
      "palette": [
        {"r": 20, "g": 20, "b": 26},
        {"r": 182, "g": 165, "b": 142},
        {"r": 87, "g": 165, "b": 193},
        {"r": 70, "g": 92 ,"b": 113},
        {"r": 76, "g": 121, "b": 159},
        {"r": 104, "g": 71, "b": 45},
        {"r": 70, "g": 87, "b": 74}
      ]
    },
    ...
  ],
  "readme": "# Seti UI\n\n[![Join the chat at https://gitter.im/jesseweed/seti-ui](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jesseweed/seti-ui?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)\n\nA dark colored UI theme for Atom with custom file icons. [Seti Syntax](https://atom.io/themes/seti-syntax) also available.\n\n![Screenshot](https://github.com/jesseweed/seti-ui/raw/master/screenshot.png)\n\n\n### Custom App Icons\n[ ![Screenshot](https://github.com/jesseweed/seti-syntax/raw/master/_icons/circular/circular-128x128.png) ](https://github.com/jesseweed/seti-syntax/tree/master/_icons/circular)\n[ ![Screenshot](https://github.com/jesseweed/seti-syntax/raw/master/_icons/rounded/rounded-128x128.png) ](https://github.com/jesseweed/seti-syntax/tree/master/_icons/rounded/)\n[ ![Screenshot](https://github.com/jesseweed/seti-syntax/raw/master/_icons/squared/squared-128x128.png) ](https://github.com/jesseweed/seti-syntax/tree/master/_icons/squared/)\n\n### Installation\n\n#### Atom Package Manager (APM)\n```bash\napm install seti-ui\n```\n\n#### Git clone\n```bash\ncd ~/.atom/packages\ngit clone https://github.com/jesseweed/seti-ui --depth=1\n```\n\n### Currently Supported File Icons\n* Bower\n* Coffescript\n* CSS\n* EJS\n* Favicon\n* Go\n* Grunt\n* Gulp\n* Handlebars\n* HTML\n* Image\n* Jade\n* Javascript\n* JSON\n* Julia\n* Less\n* LICENSE\n* Markdown\n* Mustache\n* PHP\n* Procfile\n* Python\n* React\n* Ruby\n* Sass\n* Stache\n* Stylus\n* Text\n* Typescript\n* XML\n* YML\n"
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