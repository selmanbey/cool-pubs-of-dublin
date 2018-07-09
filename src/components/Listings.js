import React from 'react'
import PropTypes from 'prop-types'

class Listings extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.highlightAndAnimate = this.highlightAndAnimate.bind(this);
    this.cancelHighlightAndAnimation = this.cancelHighlightAndAnimation.bind(this);

    this.state = {
      searchedText: "",
    }
  }

  highlightAndAnimate(e) {
    e.target.style.color = "#c22f3c";

    this.props.filteredMarkers.filter( (marker) => (
      marker.title === e.target.innerText
    )).forEach( (marker) => {
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
    })
  }

  cancelHighlightAndAnimation(e) {
    e.target.style.color = "#000";

    this.props.filteredMarkers.filter( (marker) => (
      marker.title === e.target.innerText
    )).forEach( (marker) => {
      marker.setAnimation(null)
    })
  }

  onChange(e) {
    this.setState({
      searchedText: e.target.value,
    })
    this.props.sendSearchTerm(e.target.value)
  }

  render () {

    let filteredPubsList = [];

    for (let pub of this.props.filteredPubs) {
      filteredPubsList.push(
        <li
          key={ pub[3] }
          ref={ pub[3] }
          onMouseOver={ this.highlightAndAnimate }
          onMouseLeave={ this.cancelHighlightAndAnimation }
          onClick= { this.props.openDialog }
          > { pub[0] } </li>
      )}

    return(
    <div className="listings-container">
      <form className="search-form">
        <label>Filter Through Pubs:</label><br/>
        <input type="text" value={ this.state.searchedText } onChange={ this.onChange }></input>
      </form>

      <br/>
      <hr/>

      <div className="listing-results">
        <ul>
          <strong className="filtered-pubs-titles"> FILTERED PUBS: </strong><br/>
          <br/>
          { filteredPubsList }
        </ul>
      </div>
    </div>
  )}
}


Listings.propTypes = {
  sendSearchTerm: PropTypes.func.isRequired,
  filteredPubs: PropTypes.array.isRequired,
  filteredMarkers: PropTypes.array.isRequired,
}

export default Listings;
