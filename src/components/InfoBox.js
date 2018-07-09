import React from 'react'
import PropTypes from 'prop-types'

class InfoBox extends React.Component {
  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this)
    this.createImgSrc = this.createImgSrc.bind(this)
  }

  state = {
    content: "",
  }

  fetchFourSquareData(venueID) {
    let clientID = "0JZAML2WWTU351RZ0IXPJ5505QHJ0Q1YUN2OD2ARL5VDMXVM"
    let clientSecret = "WNBE2LA2G45L3XCQ2L3CD2M2H2ALQ41W0LFJADLVDG4JXVDW"
    let fourSquareURL = `https://api.foursquare.com/v2/venues/${ venueID }?client_id=${ clientID }&client_secret=${ clientSecret }&v=20180609`

    let newData = fetch(fourSquareURL)
    .then( (res) => (res.json()) )
    .then( (data) => {
      return data
    })

    return newData;
  }

  // Processes fetched FourSquare data into an array to be passed to renderContent method
  processFourSquareData(marker) {
    return this.fetchFourSquareData(marker.fourSquareVenueID)
    .then( (data) => {
      console.log("thening fetchFourSquareData:", data)
      return new Promise( (resolve, reject) => {

        let contentObject = {
          title: "",
          imgSrc: "",
          main: ""
        }

        if (data.meta.code === 429) {
          contentObject.main = "FourSquare API quota exceeded for today, so the place info couldn't be retrieved. Please try again in 24 hours."
        } else {
          console.log(data)
          // REARRANGE THIS BIT LATER
          contentObject.title = "The Back Page"
          contentObject.imgSrc = this.createImgSrc(data)
          contentObject.main = "Guzel Bir Pub"
        }

        resolve(contentObject)
      })
    })
  }

  createImgSrc(data) {
    // if photo is in the data, captures it
    // if not, returns an empty string which will result an empty photo
    // POSSIBLE OPTIMIZATION: RETURN A SOURCE FOR FAILED PICTURE FETCH
    if(data.response.venue.bestPhoto) {
      let prefix = data.response.venue.bestPhoto.prefix
      let suffix = data.response.venue.bestPhoto.suffix
      let src = prefix + "300x300" + suffix

      return src
    } else {
      return ""
    }
  }

  renderContent() {
    // just a security measure in case parent component fails to pass a marker
    if(this.props.marker) {
      this.processFourSquareData(this.props.marker)
      .then( (contentObject) => {
          console.log("renderContentActivated", contentObject)
          return(<div>
            <h1>{ contentObject.title }</h1>
            <img src={ contentObject.imgSrc } alt="Best FourSquare Picture For This Pub" />
            <p> { contentObject.main } </p>
            </div>)

      })
    } else {
      let content = "Some Unknown Error Occured Apparently Due To Poor Coding. That's Unfortunate. Maybe turn this info box off and on again?"
      return (<div> { content } </div>)
    }
  }

  componentDidUpdate() {
    this.refs.dialog.open = JSON.parse(this.props.isDialogOpen)

  }

  render () {

    let content = "Hiya!"

    return(
      <dialog className="info-box" ref="dialog">
          <button className="close-info-box" onClick={ this.props.closeDialog }>X</button>
          { this.renderContent() }
      </dialog>
    )
  }
}

export default InfoBox;
