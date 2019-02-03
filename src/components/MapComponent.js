import React from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import HeatmapOverlay from 'leaflet-heatmap'

const unprojectFeats = (featsArray) => {
  featsArray.map(item => item.geometry.coordinates = [L.Projection.SphericalMercator.unproject(L.point(item.geometry.coordinates)).lng, L.Projection.SphericalMercator.unproject(L.point(item.geometry.coordinates)).lat]);
  return featsArray;
}

const setHmData = (featsArray) => {
  const hmData = featsArray.map(item => {return {lat:item.geometry.coordinates[1], lng:item.geometry.coordinates[0], count: 1}})
  return hmData
}

class MapComponent extends React.Component {

  
  componentDidMount() {

    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      //"scaleRadius": true,
      "radius": 10,
      "maxOpacity": .8, 
      // scales the radius based on map zoom
      "scaleRadius": false, 
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries 
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'count'
    };

    const geojsonMarkerOptions = {
      radius: 3,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    const slightMarkerOptions = {
      radius: 3,
      fillColor: "#FFFF00",
      color:"#FFFF00",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    const seriousMarkerOptions = {
      radius: 3,
      fillColor: "#FFA500",
      color: "#FFA500",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    const fatalMarkerOptions = {
      radius: 3,
      fillColor: "#FF0000",
      color: "#FF0000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    axios.get("http://www.yomapo.com/edicycle/server/get_accidents_json.php").then(function (response) {
      const featuresArray = response.data;
      unprojectFeats(featuresArray);
      const heatMapData = setHmData(featuresArray);
      // create map
      const map = L.map('map', {
        center: [55.953092,-3.198953],
        zoom: 12,
        layers: [
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          })
        ]
      });
      var testData = {
        max: 8,
        data: heatMapData
      };
      var heatmapLayer = new HeatmapOverlay(cfg).addTo(map);
      heatmapLayer.setData(testData);
/*       L.geoJSON(featuresArray, {
        pointToLayer: function (feature, latlng) {
          switch(feature.properties.severity) {
            case 'Slight':
              return L.circleMarker(latlng, slightMarkerOptions);
            case 'Serious':
              return L.circleMarker(latlng, seriousMarkerOptions);
            case 'Fatal':
              return L.circleMarker(latlng, fatalMarkerOptions);
            default:
              console.log(feature.properties.severity);
              return L.circleMarker(latlng, geojsonMarkerOptions);
          }
      }
      }).addTo(map); */

    }).catch(function(error) {
      console.log(error)
    });
  }

  render() {
    return <div id="map" style={{minHeight: '600px'}}></div>
  }
}
export default MapComponent;