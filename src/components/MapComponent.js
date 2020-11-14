import React from 'react';
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Circle, Popup} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import * as d3 from "d3";


class MapComponent extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        lat: 55.953092,
        lng: -3.198953,
        zoom: 12,
      }
      this.handleZoomChange = this.handleZoomChange.bind(this);

      this.geojsonMarkerOptions = {
        radius: 3,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }

    handleZoomChange = (e) => {
      const zoom = e.target.getZoom();
      this.setState({
        zoom
      });
    }

    getCirclesStyle(type) {
      return {
        radius: 3,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    }

    calculateRadius(zoom) {
      let radius;
      if (zoom < 15) {
        radius = 13
      } else if (zoom === 15) {
        radius = zoom / 2
      } else if (zoom === 16) {
        radius = zoom / 3
      } else if (zoom > 16) {
        radius = zoom / 6.5
      }
      return radius;
    }


  componentDidMount() {
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
  }

  componentDidUpdate(prevProps) {
      this.testData = {
        max: 8,
        data: this.props.heatMapData
      };
      d3.select(".leaflet-overlay-pane")
        .attr("class","shadow leaflet-overlay-pane leaflet-pane");
  }

  render() {
    const position = [this.state.lat, this.state.lng]
/*     const gradient = {
      0.1: '#ff1493', 0.2: '#ff1493', 0.4: '#0000ff',
      0.6: '#ff8c00', 0.8: '#ff8c00', 1.0: '#ff8c00'
    }; */
    const gradient = {
      0.1: '#ff1493', 0.2: '#ff1493', 0.4: '#0000ff',
      0.6: '#ffffff', 0.8: '#ffffff', 1.0: '#ffffff'
    };

    let baseMapCSSStyle = {minHeight: '100%', minWidth: '100%'};
    
    const { currentBgTheme } = this.props;
    const backgroundMapUrl = currentBgTheme === 'light' ? 
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' :
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';

    const attribution = currentBgTheme === 'light' ? 
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' :
    'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.';

    baseMapCSSStyle = currentBgTheme === 'light' ? baseMapCSSStyle :
    {...baseMapCSSStyle, filter: 'brightness(1.75)'}

    let circlesLayer = null;
    
    if(!Array.isArray(this.props.accPoints) ) {

      circlesLayer = this.props.accPoints.data.accidents.map((item, index) => { 
        const colorMap = {
          'Slight': 'green',
          'Serious': 'yellow',
          'Fatal': 'red'
        }
        return <Circle
        key={index} 
        center={[item.geometry.coordinates[1], item.geometry.coordinates[0]]} 
        stroke={false}
        fillColor={colorMap[item.properties.casualty_severity]} 
        fillOpacity={1}
        radius={ this.calculateRadius(this.state.zoom) }>
          <Popup>Severity: {item.properties.casualty_severity} Year: {item.properties.year}</Popup></Circle>} )
    }

    const heatMapLayer = <HeatmapLayer
          radius={7}
          minOpacity={0.2}
          gradient={gradient}
          blur={8}
          points={this.props.heatMapData}
          longitudeExtractor={m => m.lng}
          latitudeExtractor={m => m.lat}
          intensityExtractor={m => parseFloat(m.count)* 10000} />

    const overlay = currentBgTheme === 'light' ? circlesLayer : heatMapLayer;

    return (
    <Map center={position} zoom={this.state.zoom} style={baseMapCSSStyle} onzoom={this.handleZoomChange}>
      <TileLayer
        attribution={attribution}
        url={backgroundMapUrl} 
        />
        {overlay}
    </Map>)
  }

}
export default MapComponent;