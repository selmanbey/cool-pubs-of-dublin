import React from 'react'
import PropTypes from 'prop-types'

class GoogleMap extends React.Component {

  render () {
    return(
      <div id="map"/>
    )
  }
}

GoogleMap.propTypes = {
  markerData: PropTypes.array
}

export default GoogleMap;
