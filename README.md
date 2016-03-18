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

Without options:
```js
// themes.get('monokai')

{
  "name": "monokai",
  "author": {
    "name": "kevinsawicki",
    "image": "https://github.com/kevinsawicki.png",
    "url": "https://atom.io/users/kevinsawicki"
  },
  "repo": "https://github.com/kevinsawicki/monokai",
  "downloads": 330348,
  "stars": 658,
  "images": [
    {
      "url": "https://f.cloud.github.com/assets/671378/2265671/d02ebee8-9e85-11e3-9b8c-12b2cb7015e3.png"
    }
  ]
}

```

With options:  
- `package: true` - Include package.json as the `package` prop.
  - Causes extra request.
  - The `readme` property and any property beginning with `_` are removed.
- `readme: true` - Include the repository's readme.
  - Requires GitHub API call.
- `images: true` - Include image metadata such as size and colors.
  - Causes extra network requests.
  - Detects if the image's background is dark or light.
  - The image palette contains 6-10 colors.
  - :warning: Only supported filetypes will have metadata. (No metadata for svg, gif, etc...)

:warning: GitHub throttles unauthenticated requests to 60 per hour :warning:


```js
// themes.get('monokai', {package: true, readme: true, images: true})

{
  "name": "monokai",
  "author": {
    "name": "kevinsawicki",
    "image": "https://github.com/kevinsawicki.png",
    "url": "https://atom.io/users/kevinsawicki"
  },
  "repo": "https://github.com/kevinsawicki/monokai",
  "downloads": 330350,
  "stars": 658,
  "package": {
    "name": "monokai",
    "theme": "syntax",
    "version": "0.18.0",
    "private": true,
    "description": "A monokai theme",
    "repository": "https://github.com/kevinsawicki/monokai",
    "license": "MIT",
    "engines": {
      "atom": ">0.39.0"
    }
  },
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

© 2016 Andrea Stella, ISC license.