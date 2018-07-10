import React from 'react'
import PropTypes from 'prop-types'

class GreetingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.closeDialog = this.closeDialog.bind(this)
  }

  closeDialog() {
    this.refs.dialog.classList.add("display-none")
  }

  componentDidMount() {
    document.addEventListener("keydown", (e) => {
      if(e.key === "Enter") {
        this.closeDialog();
      }
    })
  }

  render () {
    return(
      <dialog ref="dialog" className="greeting-box" open onClick={ this.closeDialog }>
        <h1 className="greeting-title">COOL PUBS OF DUBLIN</h1>
      </dialog>
    )
  }
}

export default GreetingScreen;
