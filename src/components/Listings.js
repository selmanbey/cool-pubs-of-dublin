import React from 'react'

class Listings extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.highlightAndAnimate = this.highlightAndAnimate.bind(this);
    this.cancelHighlightAndAnimation = this.cancelHighlightAndAnimation.bind(this);
    this.processLiClick = this.processLiClick.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.processLiEnter = this.processLiEnter.bind(this);
    this.handleEnterForFilterButton = this.handleEnterForFilterButton.bind(this);
    this.lockFocusInSection = this.lockFocusInSection.bind(this);
    // this.lockFocusInSection = this.lockFocusInSection.bind(this);

    this.state = {
      searchedText: "",
    }
  }

  // highlights the list element and animates the connected marker
  highlightAndAnimate(e) {
    e.target.style.color = "#c22f3c";

    this.props.filteredMarkers.filter( (marker) => (
      marker.title === e.target.innerText
    )).forEach( (marker) => {
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
    })
  }

  // cancels highlight and animation
  cancelHighlightAndAnimation(e) {
    e.target.style.color = "#000";

    this.props.filteredMarkers.filter( (marker) => (
      marker.title === e.target.innerText
    )).forEach( (marker) => {
      marker.setAnimation(null)
    })
  }

  // helps creating a controlled component by storing user input in the state
  onChange(e) {
    this.setState({
      searchedText: e.target.value,
    })
    this.props.sendSearchTerm(e.target.value)
  }

  // opens and closes the listing window
  toggleDisplay() {
    this.refs.listings.classList.toggle("display")
    if (this.refs.listings.classList.contains("display")) {
      document.addEventListener('keyup', this.lockFocusInSection);
    } else {
      document.removeEventListener('keyup', this.lockFocusInSection);
    }
  }

  // reports the currently active marker to the parent component
  // updates parents components state
  getAndSendCurrentMarker(e) {
    this.props.filteredMarkers.filter( (marker) => (
      marker.title === e.target.innerText
    )).forEach( (marker) => {
      this.props.setCurrentMarker(marker)
    })

  }

  // handles click events for pub names in the filtered pubs list
  processLiClick(e) {
    this.props.openDialog();
    this.getAndSendCurrentMarker(e);
  }

  processLiEnter(e) {
    if(e.key === "Enter") {
      this.processLiClick(e)
    }
  }

  handleEnterForFilterButton(e) {
    if(e.key === "Enter") {
      this.toggleDisplay()
    }
  }

  lockFocusInSection(e) {
    let focusableElements = []
    focusableElements.push(document.querySelector("input"))
    document.querySelectorAll("li").forEach( (li) => {
      focusableElements.push(li)
    })

    let firstElement = focusableElements[0]

    if(e.key === "Escape") {
      document.querySelector("#filter-toggle-button").focus();
    }

    if(e.key === "Tab") {
      if(!focusableElements.includes(e.target)
      && !document.querySelector(".info-box").open) {
      // second if parameter checks if focus need to switched to InfoBox
        firstElement.focus();
      }
    }
  }

  render () {

    let filteredPubsList = [];

    for (let pub of this.props.filteredPubs) {
      filteredPubsList.push(
        <li
          key={ pub[3] }
          ref={ pub[3] }
          tabIndex="0"
          onMouseOver={ this.highlightAndAnimate }
          onMouseLeave={ this.cancelHighlightAndAnimation }
          onClick= { this.processLiClick }
          onKeyPress={ this.processLiEnter }
          > { pub[0] } </li>
      )}

    return(
      <div>
        <div id="filter-toggle-button" tabIndex="0" role="button" aria-label="toggle filter box" className="filter-button display" onClick={ this.toggleDisplay } onKeyPress={ this.handleEnterForFilterButton }>filter</div>
        <section id="pubfilter" title="Pub Filter" ref="listings" className="listings-container">
            <button aria-label="close info box" className="close-box" onClick={ this.toggleDisplay } onKeyPress={ this.handleEnterForFilterButton }>X</button>
            <form className="search-form">
              <label htmlFor="filter-input">Filter Through Pubs:</label><br/>
              <input ref="search" role="search" id="filter-input" type="text" value={ this.state.searchedText } onChange={ this.onChange }></input>
            </form>

            <br/>
            <hr/>

            <nav aria-labelledby="filtered-pubs" className="listing-results">
              <strong id="filtered-pubs" className="filtered-pubs-titles"> FILTERED PUBS: </strong><br/>
              <ul>
                { filteredPubsList }
              </ul>
            </nav>
          </section>
        </div>
    )
  }
}

export default Listings;
