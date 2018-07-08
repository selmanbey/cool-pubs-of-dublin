import React, { Component } from 'react';
import './App.css';
import GoogleMap from './components/GoogleMap'
import Listings from './components/Listings'

class App extends Component {
  constructor(props) {
    super(props);

    this.filterPubs = this.filterPubs.bind(this);
    this.setFilteringTerm = this.setFilteringTerm.bind(this);
    this.setNewPubsState = this.setNewPubsState.bind(this);
  }

  state = {
    allPubs: [
      ["The Back Page", 53.358512, -6.273072, 1],
      ["The WhitWorth", 53.364690, -6.271398, 2],
      ["The Barge", 53.330602, -6.260620, 3],
      ["The Bar With No Name", 53.341897, -6.264176, 4],
      ["Library Bar", 53.343095, -6.263909, 5],
      ["The Workman's Club", 53.345346, -6.266407, 6],
      ["Wigwam", 53.347829, -6.262295, 7],
      ["The Church", 53.348630, -6.266713, 8],
      ["4 Dame Lane", 53.343802, -6.262859, 9],
      ["The Pavilion Bar", 53.342717, -6.252905, 10]
    ],
    pubs: [],
    filteringTerm: "",
  }

  filterPubs(allPubs, filteringTerm) {
      let cleanfilteringTerm = filteringTerm.trim().toLowerCase()

      let filteredPubs = allPubs.filter( (pub) => {
        return pub[0].toLowerCase().includes(cleanfilteringTerm)
      })

      return filteredPubs
  }

  setNewPubsState() {
    let filteredPubs = this.filterPubs(this.state.allPubs, this.state.filteringTerm);
    this.setState({ pubs: filteredPubs })
  }

  setFilteringTerm(term) {
    this.setState({ filteringTerm: term }, this.setNewPubsState )
  }

  componentWillMount() {
    if (!this.state.filteringTerm) {
      this.setState({ pubs: this.state.allPubs})
    } else {
      this.setNewPubsState();
    }
  }

  render() {
    return (
      <div className="app">
        <Listings
            sendSearchTerm= { this.setFilteringTerm }
            filteredPubs= { this.state.pubs }
          />
        <GoogleMap
          markerData={ this.state.pubs }/>
      </div>
    );
  }
}

export default App;
