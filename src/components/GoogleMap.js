import React from 'react'
import PropTypes from 'prop-types'

class GoogleMap extends React.Component {

  render () {
    return(
      <div id="map" role="application" aria-label="Google Maps"/>
    )
  }
}

GoogleMap.propTypes = {
  markerData: PropTypes.array
}

export default GoogleMap;
