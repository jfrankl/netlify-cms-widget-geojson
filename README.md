# Netlify CMS Widget GeoJSON

A Netlify CMS widget that allows drawing points, lines, and polygons. This is still in very early stages.

## Install

As an npm package:

```shell
npm install --save netlify-cms-widget-geojson
```

```js
import geojson from 'netlify-cms-widget-geojson'

CMS.registerWidget('geojson', GeoControl, GeoPreview)
```

Via `script` tag:

```html
<script src="https://unpkg.com/netlify-cms-widget-geojson@^0.0.1"></script>

<script>
  CMS.registerWidget('geojson', GeoControl, GeoPreview)
</script>
```

## How to use

Add to your Netlify CMS configuration:

```yaml
fields:
  - {label: "Geometry", name: "geojson", widget: geojson, draw: 'polygon', single: false, lat: 0, lng: 0, zoom: 1 }
```

- `draw`: Sets the type of geometry you can draw. Options: `marker`, `polyline`, and `polygon`. Remove property if you want to be able to draw all types.
- `single`: Default: `false`. Set to `true` to limit the user to drawing one feature.
- `lat`, `lng`, `zoom`: Set the default position for the map.
