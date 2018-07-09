import React from 'react'
import PropTypes from 'prop-types'

class InfoBox extends React.Component {

  fetchFourSquareData(venueID) {
    let clientID = "0JZAML2WWTU351RZ0IXPJ5505QHJ0Q1YUN2OD2ARL5VDMXVM"
    let clientSecret = "WNBE2LA2G45L3XCQ2L3CD2M2H2ALQ41W0LFJADLVDG4JXVDW"
    let fourSquareURL = `https://api.foursquare.com/v2/venues/${ venueID }?client_id=${ clientID }&client_secret=${ clientSecret }&v=20180609`

    let data = fetch(fourSquareURL)
    .then( (res) => (res.json()) )
    .then( (data) => {
      return data
    })

    return data;
  }

  processFourSquareData(marker) {
    this.fetchFourSquareData(marker.fourSquareVenueID)
    .then( (data) => {
      let endPoint = data.response.venue.bestPhoto
      // let endPoint = data.response.venue.photos.groups[0].items[0]
      let prefix = endPoint.prefix
      let suffix = endPoint.suffix
      console.log(prefix + "300x300" + suffix)
      // console.log(endPoint)
    })
  }

  componentDidUpdate() {
    this.refs.dialog.open = JSON.parse(this.props.isDialogOpen)
  }

  render () {

    let content = "Hiya!"

    return(
      <dialog className="info-box" ref="dialog">
          <button className="close-info-box" onClick={ this.props.closeDialog }>X</button>
          { content }
      </dialog>
    )
  }
}

export default InfoBox;
