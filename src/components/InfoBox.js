import React from 'react'
import PropTypes from 'prop-types'

class InfoBox extends React.Component {

  componentDidMount() {
    this.refs.dialog.open = JSON.parse(this.props.isDialogOpen)
    console.log(this.refs.dialog)
  }

  render () {

    let content = "Hiya!"

    return(
      <dialog className="info-box" ref="dialog">
          <button className="close-info-box">X</button>
          { content }
      </dialog>
    )
  }
}

export default InfoBox;
