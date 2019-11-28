import './style.css';
import 'ol/ol.css'
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Tile as TileLayer, Vector as VectorLayer, VectorImage } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import Feature from 'ol/Feature.js';
import { LineString, Point } from 'ol/geom.js';
import { fromLonLat } from 'ol/proj.js';
import { Stroke, Style } from 'ol/style.js';

var map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      new VectorImage({
       source: new VectorSource({
         features: [] //createLineFeatures(style, numSegments)
       })
      })
    ],
    view: new View({
      center: fromLonLat([-92.65, 29.75]),
      zoom: 7 
    })
  });

var raster = new TileLayer({
  source: new OSM()
});

var source = new VectorSource({ wrapX: false });

var vector = new VectorLayer({
  source: source
});

var points = new Array(
  fromLonLat([0, 51]),  
  fromLonLat([1, 52])   
);

var featureLine = new Feature({
  geometry: new LineString(points),
  dashOffset: 0
});

var outlineStroke = new Style({
  stroke: new Stroke({
    color: [25, 25, 255, 1],
    width: 5,
  })
});

// use style caching in production
function getAnimationStrokeStyle() {
  return new Style({
    stroke: new Stroke({
      color: [204, 204, 255, 1],
      width: 3,
      lineDash: [2, 7],
      lineDashOffset: featureLine.get('dashOffset')
    })
  });
}

function getStyle() {
  return [outlineStroke, getAnimationStrokeStyle()];
}

featureLine.setStyle(getStyle);

source.addFeature(featureLine);

var map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: fromLonLat([0.5, 51.5]),
    zoom: 7
  })
});

// animate the line by constantly adjusting the dashOffset
// because the offset is stored as a property on the feataure,
// setting it will cause a refresh which will redraw using the
// new value
setInterval(function () {
  let offset = featureLine.get('dashOffset');
  offset = offset == 8 ? 0 : offset+1;
  featureLine.set('dashOffset', offset);
}, 100);

