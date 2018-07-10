import React, { Component } from 'react'
import ReactDom from 'react-dom'
import './App.css'
import GoogleMap from './components/GoogleMap'
import Listings from './components/Listings'
import InfoBox from './components/InfoBox'
import GreetingScreen from './components/GreetingScreen'

// keeps the lengthy consts in seperate .js files and imports them here
import googleMapStyles from './consts/googleMapStyles'
import allPubs from './consts/allPubs'


class App extends Component {
  constructor(props) {
    super(props);

    this.filterPubs = this.filterPubs.bind(this);
    this.setFilteringTerm = this.setFilteringTerm.bind(this);
    this.setNewPubsState = this.setNewPubsState.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
    this.fireAFetchEvent = this.fireAFetchEvent.bind(this);
    this.fetchFourSquareData = this.fetchFourSquareData.bind(this);
  }

  state = {
    filteringTerm: "",
    allPubs: allPubs,
    pubs: [],
    allMarkers: [],
    markers: [],
    currentMarker: null,
    fourSquareData: null,
    map: null,
    isDialogOpen: "false", //has to be string since it's passed as a prop in html

  }

  /***************************************************************************/
  /**************************** CUSTOM METHODS *******************************/
  /***************************************************************************/

  // METHODS TO INITIALIZE MAP & MARKERS
  // getGoogleMaps, initMap, setMarkersInitially, addEventListenersToMarker

  getGoogleMaps() {
    if(!this.googleMapsPromise) {
      // Creates and returns a promise to be able to then it afterwards
      this.googleMapsPromise = new Promise( (resolve) => {

        // Adds a global handler for when the API finishes loading
        // This bit of code is adopted from https://stackoverflow.com/questions/48493960/using-google-map-in-react-component
        window.resolveGoogleMapsPromise = () => {
          resolve()
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

  // initializes the map and injects it to a DOM elemet
  initMap() {
    if(!this.state.map) {

      let googleMapDomNode = ReactDom.findDOMNode(this.refs.map)

      let center;
      let zoom;

      if (window.matchMedia("(min-width: 600px)").matches) {
        // re-arranges map center for smaller screens (phones, tablets etc.)
        center = { lat: 53.349162, lng: -6.289282 };
        zoom = 13.8;
      } else {
        center = { lat: 53.349162, lng: -6.259282 };
        zoom = 13.5;
      }

      let map = new window.google.maps.Map(googleMapDomNode, {
          center: center,
          zoom: zoom,
          styles: googleMapStyles,
          disableDefaultUI: true
      })

      this.setState({ map: map })
    }
  }

  // sets the initiial markers on the map
  setMarkersInitially(map, pubs) {
    let markers = [];

    let customIcon = {
      // adjusted from https://raw.githubusercontent.com/scottdejonge/map-icons/master/src/icons/postal-code.svg

      path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
      fillColor: '#f59237',
      fillOpacity: 1,
      scale: 0.7,
      strokeColor: '#963535',
      strokeWeight: 1,
      size: new window.google.maps.Size(20, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(0, 32),
    }

    for (let i = 0; i < pubs.length; i++) {
        let pub = pubs[i];

        let marker = new window.google.maps.Marker({
          position: {lat: pub[1], lng: pub[2]},
          map: map,
          icon: customIcon,
          animation: window.google.maps.Animation.DROP,
          title: pub[0],
          zIndex: pub[3],
          fourSquareVenueID: pub[4],
        });

        let infoWindow = new window.google.maps.InfoWindow({
          content: pub[0]
        })

        this.addEventListenersToMarker(map, marker, infoWindow)

        markers.push(marker)
    }

    this.setState({
      allMarkers: markers,
      markers: markers
    })
  }

  // sets the mouseover, mouseout and click events for all markers
  addEventListenersToMarker(map, marker, infoWindow) {
    marker.addListener("mouseover", () => {
      infoWindow.open(map, marker);
    })

    marker.addListener("mouseout", () => {
      infoWindow.close();
    })

    marker.addListener("click", () => {
      this.setCurrentMarker(marker);
      this.openDialog();
    })
  }

  // METHODS TO ADJUST STATE WHEN FILTER IS USED
  // filterPubs, setNewPubsState, setFilteringTerm

  // sets the filter parameter, gets called from the child component Listings.js
  setFilteringTerm(term) {
    this.setState({ filteringTerm: term }, () => {
      this.setNewPubsState();
      this.setNewMarkersState();
    })
  }

  // real time filtering of the pubs following user input
  filterPubs(allPubs, filteringTerm) {
      let cleanfilteringTerm = filteringTerm.trim().toLowerCase()

      let filteredPubs = allPubs.filter( (pub) => {
        return pub[0].toLowerCase().includes(cleanfilteringTerm)
      })

      return filteredPubs
  }

  // real time re-rendering of the markers on the map following user input
  filterMarkers(allMarkers, filteringTerm) {
    let cleanfilteringTerm = filteringTerm.trim().toLowerCase()

    let filteredMarkers = allMarkers.filter( (marker) => {
      return marker.title.toLowerCase().includes(cleanfilteringTerm)
    })

    return filteredMarkers
  }

  //updates filteredPubs in the state
  setNewPubsState() {
    let filteredPubs = this.filterPubs(this.state.allPubs, this.state.filteringTerm);
    this.setState({ pubs: filteredPubs })
  }

  //updates filteredMarkers in the state
  setNewMarkersState() {
    this.clearAllMarkers();
    let filteredMarkers = this.filterMarkers(this.state.allMarkers, this.state.filteringTerm)
    this.setState({ markers: filteredMarkers })
    this.setMarkersOnMap(filteredMarkers)
  }

  // METHODS TO MANUALLY ADJUST VIEW ACCORDING TO STATE CHANGES
  // clearAllMarkers, setMarkersOnMap
  clearAllMarkers() {
    for(let marker of this.state.allMarkers) {
      marker.setMap(null)
    }
  }

  setMarkersOnMap(markers) {
    for(let marker of markers) {
      marker.setAnimation(window.google.maps.Animation.DROP)
      marker.setMap(this.state.map)
    }
  }

  /***************************************************************************/
  /************** METHODS FOR OTHER COMPONENTS' USE **************************/
  /***************************************************************************/

  // to render InfoBox on the view
  openDialog() {
    this.setState({ isDialogOpen: "true" })
  }

  // to hide InfoBox from the view
  closeDialog() {
    this.setState({ isDialogOpen: "false", currentMarker: null });
  }

  setCurrentMarker(marker) {
    this.setState({ currentMarker: marker})
    this.fireAFetchEvent(marker)
  }

  // fires a FourSquare API fetch. called by setCurrentMarker upon marker click
  fireAFetchEvent(marker) {
    this.fetchFourSquareData(marker.fourSquareVenueID)
  }

  // sends an AJAX API request to FourSquare and updates the state with the data returned
  fetchFourSquareData(venueID) {
    let clientID = "0JZAML2WWTU351RZ0IXPJ5505QHJ0Q1YUN2OD2ARL5VDMXVM"
    let clientSecret = "WNBE2LA2G45L3XCQ2L3CD2M2H2ALQ41W0LFJADLVDG4JXVDW"
    let fourSquareURL = `https://api.foursquare.com/v2/venues/${ venueID }?client_id=${ clientID }&client_secret=${ clientSecret }&v=20180609`

    fetch(fourSquareURL)
    .then( (res) => (res.json()) )
    .then( (data) => {
      this.setState({ fourSquareData: data});
    })
    .catch( (error) => {
      alert("Failed to fetch FourSquare API. Please check your internet connection.", error);
      this.closeDialog();
    })
  }


  /***************************************************************************/
  /*************************** LIFECYCLE HOOKS *******************************/
  /***************************************************************************/

  componentWillMount() {
    if (!this.state.filteringTerm) {
      this.setState({ pubs: this.state.allPubs})
    } else {
      this.setNewPubsState();
    }
  }

  componentDidMount() {
    if(!this.googleMapsPromise) {
      this.getGoogleMaps()
      .then( () => {
        this.initMap();
        this.setMarkersInitially(this.state.map, this.state.pubs);
      })
    }

    // fixes accessibility issues
    // (1) GoogleMaps generates an <iframe> without a title
    // (2) GoogleMaps generates a <div> that needs to be taken out of tabIndex
    window.addEventListener('load', function () {
      document.querySelector('iframe').title = 'Google Maps'
      window.setTimeout(function() {
        document.querySelector(".gm-style").children[0].setAttribute("tabindex", "-1")
      }, 1000)
    })
  }

  render() {
    return (
      <div className="app" role="main">

        <GreetingScreen />

        <Listings
            sendSearchTerm= { this.setFilteringTerm }
            filteredPubs= { this.state.pubs }
            filteredMarkers= { this.state.markers }
            openDialog= { this.openDialog }
            setCurrentMarker= { this.setCurrentMarker }
          />

        <InfoBox
          isDialogOpen={ this.state.isDialogOpen }
          closeDialog={ this.closeDialog }
          fourSquareData= { this.state.fourSquareData } />

        <GoogleMap
          ref="map"
          markerData={ this.state.pubs }/>
      </div>
    );
  }
}

export default App;
