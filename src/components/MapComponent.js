import React from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

class MapComponent extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map('map', {
      center: [55.953092,-3.198953],
      zoom: 12,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });
  }
  render() {
    return <div id="map" style={{minHeight: '600px'}}></div>
  }
}
export default MapComponent;