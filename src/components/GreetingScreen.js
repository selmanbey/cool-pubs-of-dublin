import React from 'react'
import ReactDom from 'react-dom'


class GreetingScreen extends React.Component {
  // this component only renders the initial screen. it closes when clicked on
  // or pressed enter and does not appear again.
  constructor(props) {
    super(props);

    this.closeDialog = this.closeDialog.bind(this)
    this.closeWithEnterAndEscape = this.closeWithEnterAndEscape.bind(this)
    this.cancelTabEvent = this.cancelTabEvent.bind(this)
  }

  closeDialog() {
    this.refs.dialog.classList.add("display-none")
    document.removeEventListener('keydown', this.cancelTabEvent)
    document.removeEventListener('keydown', this.closeWithEnterAndEscape)
  }

  componentDidMount() {
    this.lockFocus();
    document.addEventListener("keydown", this.closeWithEnterAndEscape);
  }

  // locks the focus within the greeting screen
  lockFocus() {
    // adjusted from https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it
    let dialogDomNode = ReactDom.findDOMNode(this.refs.dialog)

    dialogDomNode.focus();
    document.addEventListener('keydown', this.cancelTabEvent);
  }

  cancelTabEvent(e) {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  closeWithEnterAndEscape(e) {
    if(e.key === "Enter" || e.key === "Escape") {
      this.closeDialog();
    }
  }

  render () {
    return(
        <dialog ref="dialog" aria-label="Greeting Screen" role="button" className="greeting-box" open onClick={ this.closeDialog }>
        <h1 className="greeting-title">COOL PUBS OF DUBLIN</h1>
      </dialog>
  )
  }
}

export default GreetingScreen;
