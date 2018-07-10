import React from 'react'

class InfoBox extends React.Component {
  constructor(props) {
    super(props);

    this.createImgSrc = this.createImgSrc.bind(this);
    this.lockFocusInSection = this.lockFocusInSection.bind(this);
  }

  // takes raw fetched data from parent component and turns it into render-ready form
  processFourSquareData(data) {
      let contentObject = {
        title: "",
        imgSrc: "",
        link: "",
        status: ""
      }

      if (!data) {
        contentObject.title = "Data is being fetched at the moment. Please be patient. If you have been patient enough already, there is also a chance that there is something wrong with your current internet connection."
        contentObject.status = "fetching"
      } else if (data.meta.code === 429) {
        contentObject.title = "FourSquare API quota exceeded for today, so the place info couldn't be retrieved. Please try again in 24 hours."
        contentObject.status = "quota_exceeded"
      } else if (data.response.hasOwnProperty("venue")) {
        contentObject.title = data.response.venue.name
        contentObject.imgSrc = this.createImgSrc(data)
        contentObject.link = data.response.venue.canonicalUrl
        contentObject.status = "success"
      } else {
        contentObject.title = "An unknown error occured"
        contentObject.status = "unkown_error"
      }

      return contentObject
  }

  // helper function for processFourSquareData. arranges the img src.
  createImgSrc(data) {
    if(data.response.hasOwnProperty("venue")) {
    // if photo is in the data, captures it
    // if not, returns an empty string which will result an empty photo
      let prefix = data.response.venue.bestPhoto.prefix
      let suffix = data.response.venue.bestPhoto.suffix
      let src = prefix + "300x300" + suffix

      return src
    } else {
      return ""
    }
  }

  lockFocusInSection(e) {
    let focusableElements = []
    document.querySelectorAll(".focusable-element").forEach( (li) => {
      focusableElements.push(li)
    })

    let firstElement = focusableElements[0]

    if(e.key === "Tab") {
      if(!focusableElements.includes(e.target)) {
      // second if parameter checks if focus need to switched to InfoBox
        firstElement.focus();
      }
    }
  }

  componentDidUpdate() {
    // lets parent to decide to render this component or not via props
    this.refs.dialog.open = JSON.parse(this.props.isDialogOpen)

    if(this.refs.dialog.open) {
      document.addEventListener("keyup", this.lockFocusInSection)
    } else {
      document.removeEventListener("keyup", this.lockFocusInSection)
    }
  }

  componentDidMount() {
    // lets pressing the escape key to close the infoBox
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape") {
        this.props.closeDialog()
      }
    })
  }

  render () {

    let contentObject = this.processFourSquareData(this.props.fourSquareData)

    if ( contentObject.status === "fetching" ||
         contentObject.status === "quota_exceeded" ||
         contentObject.status === "unkown_error"
    ) {
      // if the proper data is not available, renders the relevant message in the box
      return (
        <dialog className="info-box" ref="dialog">
          <button className="close-box focusable-element" onClick={ this.props.closeDialog }>X</button>
          <br/>
          <p className="info-box-message"> { contentObject.title } </p>
        </dialog>
      )
    }

    // if the proper data is available, renders the relevant data
    return(
        <dialog aria-label="Info Box" className="info-box" ref="dialog">
            <button aria-label="close info box" className="close-box focusable-element" onClick={ this.props.closeDialog }>X</button>
            <h1>{ contentObject.title }</h1>
            <div className="img-container">
              <img className="pub-img" src={ contentObject.imgSrc } alt={ contentObject.title }/>
            </div>
            <br/>
            <a className="focusable-element" role="button" aria-label="Go to FourSquare Page" href={ contentObject.link }>See Details On FourSquare</a>
            <br/>
            <p className="hint">Click on X or press "escape" to close this info box</p>
        </dialog>
    )
  }

}

export default InfoBox;
