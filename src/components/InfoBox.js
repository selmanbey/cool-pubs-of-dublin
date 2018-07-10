import React from 'react'
import PropTypes from 'prop-types'

class InfoBox extends React.Component {
  constructor(props) {
    super(props);

    // this.renderContent = this.renderContent.bind(this)
    this.createImgSrc = this.createImgSrc.bind(this)
  }

  processFourSquareData(data) {
      let contentObject = {
        title: "",
        imgSrc: "",
        link: ""
      }

      if (!data) {
        console.log(data)
        contentObject.title = "Data is being fetched at the moment. Please be patient!"
      } else if (data.meta.code === 429) {
        contentObject.title = "FourSquare API quota exceeded for today, so the place info couldn't be retrieved. Please try again in 24 hours."
      } else if (data.response.hasOwnProperty("venue")) {
        contentObject.title = data.response.venue.name
        contentObject.imgSrc = this.createImgSrc(data)
        contentObject.link = data.response.venue.canonicalUrl
      } else {
        contentObject.title = "An unknown error occured"
      }

      return contentObject
  }

  createImgSrc(data) {
    // if photo is in the data, captures it
    // if not, returns an empty string which will result an empty photo
    // POSSIBLE OPTIMIZATION: RETURN A SOURCE FOR FAILED PICTURE FETCH
    if(data.response.hasOwnProperty("venue")) {
      let prefix = data.response.venue.bestPhoto.prefix
      let suffix = data.response.venue.bestPhoto.suffix
      let src = prefix + "300x300" + suffix

      return src
    } else {
      return ""
    }
  }

  componentDidUpdate() {
    this.refs.dialog.open = JSON.parse(this.props.isDialogOpen)
  }

  render () {
    let contentObject = this.processFourSquareData(this.props.fourSquareData)

    return(
      <dialog className="info-box" ref="dialog">
          <button className="close-info-box" onClick={ this.props.closeDialog }>X</button>
          <h1>{ contentObject.title }</h1>
          <div className="img-container">
            <img className="pub-img" src={ contentObject.imgSrc} alt="Pub Photo"/>
          </div>
          <a href={ contentObject.link }>See Details</a>
      </dialog>
    )
  }

}

export default InfoBox;
