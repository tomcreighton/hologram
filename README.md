# Holo

A tiny, zero-dependency JS library that adds a holographic rainbow shimmer effect to images. It overlays an animated rainbow gradient that shifts as the user scrolls, simulating the look of a holographic trading card or sticker.

## Usage

Add the script to your page and put `class="holo"` on any image:

```html
<script src="holo.js"></script>

<img class="holo" src="photo.jpg" alt="Holographic photo">
```

## Options

Fine-tune per element with data attributes:

```html
<img class="holo" data-holo-speed="0.5" data-holo-opacity="0.8">
```

| Attribute | Default | Description |
|---|---|---|
| `data-holo-speed` | `0.25` | Scroll speed multiplier |
| `data-holo-opacity` | `0.6` | Rainbow overlay opacity |
| `data-holo-mask` | `auto` | Mask overlay to image shape (`true`/`false`/`auto`) |

## Transparent images

For PNGs and SVGs with transparency, the rainbow effect automatically masks to the image shape. Override with `data-holo-mask="true"` or `data-holo-mask="false"`.
