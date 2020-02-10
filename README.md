# Svelte model viewer

This is a model viewer web component made with Svelte, Typescript and Three.js

## Install
```bash
npm install --save Meshhouse-UI-Kit/model-viewer#master
```

## Usage
Currently loads only GLTF files (as more web-oriented format):
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width,initial-scale=1'>
	<title>Svelte app</title>
  <script defer src='/build/bundle.js'></script>
  <style>
    model-viewer:not(:defined) {
      opacity: 0;
    }
  </style>
</head>

<body>
  <model-viewer model="link-here.gltf" modeltitle="Boom box" author="Khronos Group" style="height: 600px;">
    <span slot="logo">Model viewer 1.0.0</span>
  </model-viewer>
</body>
</html>
```

## Attributes
**model** - URL to GLTF model, *required*
**hdri** - URL to HDR environment texture
**modeltitle** - model title
**author** - model author
**authorlink** - author link (to portfolio, etc.)
**resizable** - watch for viewer resize events, default is *true*
**autohide** - hide viewer UI after 5 seconds, default is *false*
**skycolor** - scene "sky" color, default is #dbeeff
**groundcolor** - scene ground color, default is #597a9c

## Slots
**loader** - *Loading* text
**error** - error screen
**logo** - you can set custom logo or text in left bottom corner
**material-button** - change material button icon
**rotate-button** - auto-rotate camera button icon
**fullscreen-button** - fullscreen button icon

## CSS Variables
**--theme-font** - text font, default is system-stack
**--theme-color** - main theme color (buttons background, dropdown selected item), default is #00b16a
**--theme-color-active** - main theme color, active state, default is #007e4b
**--viewer-background** - loader background color, default is #333333
**--viewer-background-error** - error screen background, default is #96281b


## License
Default button icons are made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](https://www.flaticon.com/)
This component are licensed by MIT license.
