import PropTypes from 'prop-types';
import React from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import L from 'leaflet';
import 'leaflet-draw';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});

export default class GeoControl extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    forID: PropTypes.string,
    value: PropTypes.node,
    classNameWrapper: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
  }

  config = {
    lat: this.props.field.get('lat'),
    lng: this.props.field.get('lng'),
    zoom: this.props.field.get('zoom'),
    draw: this.props.field.get('draw'),
    single: this.props.field.get('single')
  };

  handleMoveend (event) {
    const center = this.state.map.getCenter();
    const zoom = this.state.map.getZoom();
    localStorage.setItem('zoom', zoom);
    localStorage.setItem('lat', center.lat);
    localStorage.setItem('lng', center.lng);
  }

  updateWidget () {
    this.props.onChange(JSON.stringify(this.state.editableLayers.toGeoJSON()));
  }

  getGeoJSON (string) {
    if (string === '' || string === undefined) {
      return {
        "type": "FeatureCollection",
        "features": []
      };
    }
    else {
      return JSON.parse(string);  
    }
  }

  state = {
    lat: this.config.lat || localStorage.getItem('lat') || 0,
    lng: this.config.lng || localStorage.getItem('lng') || 0,
    zoom: this.config.zoom || localStorage.getItem('zoom') || 1,
    map: undefined,
    editableLayers: new L.featureGroup(),
    layerStreets: L.tileLayer('http://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }),
    layerSatellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })
  }

  addOldDataToMap () {
    const geojson = L.geoJson(this.getGeoJSON(this.props.value));    
    L.geoJson(this.getGeoJSON(this.props.value), {
      onEachFeature: (feature, layer) => {
        this.state.editableLayers.addLayer(layer);
      }
    });
    if (typeof this.props.value !== 'undefined') {
      this.state.map.fitBounds(this.state.editableLayers.getBounds(), { maxZoom: 16});
    }
  }

  getDrawSettings () {
    if (this.config.draw === 'polygon') {
      return  {
        polygon: {
          allowIntersection: false,
        },
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: false,
        polyline: false
      }
    } else if (this.config.draw === 'polyline') {
      return  {
        polygon: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: false
      }
    } else if (this.config.draw === 'marker') {
      return  {
        polygon: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        polyline: false
      }
    } else {
      return  {
        polygon: {
          allowIntersection: false,
        },
        circle: false,
        circlemarker: false,
        rectangle: false
      }
    }
  }

  componentDidMount () {
    this.state.map = L.map('map', {layers: [this.state.layerStreets]}).setView([this.state.lat, this.state.lng], this.state.zoom);
    this.state.map.addLayer(this.state.editableLayers);
    this.state.map.addControl(new L.Control.Draw({
      draw: this.getDrawSettings(),
      edit: {
        featureGroup: this.state.editableLayers
      }
    }));

    L.control.layers({
      'Streets': this.state.layerStreets,
      'Satellite': this.state.layerSatellite
    }).addTo(this.state.map);

    this.state.map.on(L.Draw.Event.CREATED, event => {
      if (this.config.single) {
        this.state.editableLayers.clearLayers();
      }
      this.state.editableLayers.addLayer(event.layer);
      this.updateWidget();
    });

    this.state.map.on(L.Draw.Event.EDITED, event => {
      this.updateWidget();
    });

    this.state.map.on(L.Draw.Event.DELETED, event => {
      this.updateWidget();
    });

    this.state.map.on("moveend", event => {
      this.handleMoveend(event);
    });

    this.addOldDataToMap();
  }

  render() {
    const {
      forID,
      value,
      onChange,
      classNameWrapper,
    } = this.props;

    return (
      <div>
        <div 
          id="map"
          style={{ height: 440, width: "100%" }}
        />
      </div>
    )
  }
}