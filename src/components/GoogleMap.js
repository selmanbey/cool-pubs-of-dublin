import React from 'react';

export default class GoogleMap extends React.Component {
  constructor(props) {
    super(props);

    this.initMap = this.initMap.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
    this.getGoogleMaps = this.getGoogleMaps.bind(this);

    this.map;
    this.markers = [];
    this.googleMapsPromise;
  }

  setMarkers(map, pubs) {

    var shape = {
      // Shapes define the clickable region of the icon. The type defines an HTML
      // <area> element 'poly' which traces out a polygon as a series of X,Y points.
      // The final coordinate closes the poly by connecting to the first coordinate.
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    var customIcon = {
      // adjusted from https://raw.githubusercontent.com/scottdejonge/map-icons/master/src/icons/postal-code.svg

      path: "M25 0c-8.284 0-15 6.656-15 14.866 0 8.211 15 35.135 15 35.135s15-26.924 15-35.135c0-8.21-6.716-14.866-15-14.866zm-.049 19.312c-2.557 0-4.629-2.055-4.629-4.588 0-2.535 2.072-4.589 4.629-4.589 2.559 0 4.631 2.054 4.631 4.589 0 2.533-2.072 4.588-4.631 4.588z",
      fillColor: '#f59237',
      fillOpacity: 1,
      scale: 0.8,
      strokeColor: '#963535',
      strokeWeight: 1,
      // This marker is 20 pixels wide by 32 pixels high.
      size: new window.google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new window.google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new window.google.maps.Point(0, 32)
    }

    // console.log("here are the pubs", pubs)
    for (var i = 0; i < pubs.length; i++) {
      var pub = pubs[i];
        var marker = new window.google.maps.Marker({
          position: {lat: pub[1], lng: pub[2]},
          map: map,
          icon: customIcon,
          shape: shape,
          animation: window.google.maps.Animation.DROP,
          title: pub[0],
          zIndex: pub[3]
        });

        this.markers.push(marker)
    }
  }

  getGoogleMaps() {
    if(!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise( (resolve) => {

        // Adds a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          resolve("Success!")
        }

        let script = document.createElement("script");
        let API =  "AIzaSyBMgRqXbrWtEyfOJp9qRLy-vwDN6KPHbHM";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        script.setAttribute("defer", "defer");
        document.body.appendChild(script);
      })
    }

    return this.googleMapsPromise;
  }

  initMap() {
    if(!this.map) {
      let styles = [
          {
              "featureType": "administrative",
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "color": "#3c3c3c"
                  }
              ]
          },
          {
              "featureType": "administrative.country",
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.country",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.country",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.province",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.province",
              "elementType": "labels.text.stroke",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.province",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.locality",
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "simplified"
                  },
                  {
                      "saturation": "5"
                  },
                  {
                      "lightness": "-39"
                  },
                  {
                      "gamma": "2.50"
                  },
                  {
                      "weight": "0.01"
                  },
                  {
                      "hue": "#00ffd9"
                  }
              ]
          },
          {
              "featureType": "administrative.neighborhood",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.land_parcel",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "visibility": "off"
                  },
                  {
                      "saturation": "5"
                  }
              ]
          },
          {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.stroke",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "all",
              "stylers": [
                  {
                      "color": "#f2f2f2"
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "landscape.man_made",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape.man_made",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape.man_made",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "on"
                  },
                  {
                      "saturation": "19"
                  }
              ]
          },
          {
              "featureType": "landscape.natural.landcover",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape.natural.landcover",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.attraction",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi.attraction",
              "elementType": "geometry.stroke",
              "stylers": [
                  {
                      "saturation": "2"
                  }
              ]
          },
          {
              "featureType": "poi.attraction",
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.attraction",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "saturation": "-2"
                  }
              ]
          },
          {
              "featureType": "poi.attraction",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.business",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi.business",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.government",
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.government",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "on"
                  },
                  {
                      "saturation": "41"
                  },
                  {
                      "gamma": "1.09"
                  },
                  {
                      "lightness": "6"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "on"
                  },
                  {
                      "saturation": "-94"
                  },
                  {
                      "lightness": "50"
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "transit.station.rail",
              "elementType": "labels.text.stroke",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit.station.rail",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                  {
                      "color": "#9dd2ec"
                  },
                  {
                      "visibility": "on"
                  }
              ]
          }
      ]

      this.map = new window.google.maps.Map(this.refs.map, {
          center: { lat: 53.347163, lng: -6.259282 },
          zoom: 13,
          styles: styles
      })
    } else {
    }


  }

  clearMarkers() {
    for(let marker of this.markers) {
      marker.setMap(null)
    }
  }

  componentWillMount() {
    this.getGoogleMaps()
  }

  componentDidMount() {
    this.getGoogleMaps().then( (successMessage) => {

      this.initMap();

      this.setMarkers(this.map, this.props.markerData);
    })
    // this.initMap();
    // console.log("GoogleMap mounted")
    //
    // this.setMarkers(this.map, this.props.markerData)
    // console.log("markers set", this.props.markerData)
  }

  componentDidUpdate() {
    this.clearMarkers();
    this.setMarkers(this.map, this.props.markerData);
  }

  render() {
    return (
      <div id="map" ref="map" />
    )
  }

}
