import React from 'react'
import PropTypes from 'prop-types'

class Listings extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      searchedText: "",
    }
  }


  onChange(e) {
    this.setState({
      searchedText: e.target.value,
    })
    this.props.sendSearchTerm(e.target.value)
  }

  render () {
    const resultsHTML = 'Buraya sonuclar gelecek'

    return(
    <div className="listings-container">
      <form className="search-form">
        <label>Filter Through Pubs:</label><br/>
        <input type="text" value={ this.state.searchedText } onChange={ this.onChange }></input>
      </form>

      <br/>
      <hr/>
      <br/>


      <div className="listing-results">
        { resultsHTML }
      </div>
    </div>
  )}
}


Listings.propTypes = {
  sendSearchTerm: PropTypes.func.isRequired,
}

export default Listings;
