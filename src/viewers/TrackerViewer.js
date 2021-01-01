import React from 'react'
import { useState, useEffect } from 'react'


function TrackerViewer(props) {
  const [trackerStatus, setTrackerStatus] = useState({
    satellite: null,
    azimuth: 0,
    elevation: 0
  })
  useEffect(() => {

    let setter = (data) => {
      if (data)
        setTrackerStatus(data)
    }

    setter();

    if (props.socketController)
      props.socketController.subscribe(setter, 'tracker')

    return () => {
      if (props.socketController)
        props.socketController.unsubscribe(setter, 'tracker')
    }
  }, [props.socketController])

  return <div>
    <p>
      <b >Status:</b>
      <span className={" " + (trackerStatus.satellite ? "tracking-active" : "tracking-idle")}>⬤</span>
      {trackerStatus.satellite ? 'Tracking' : 'Idle'}
      
    </p>
    <p>
      <b>Satellite:</b>
      {trackerStatus.satellite ? trackerStatus.satellite.name : 'N/A'}
    </p>
    <p>
      <b>Azimuth</b>
      {trackerStatus.azimuth.toFixed(1)}°
    </p>
    <p>
      <b>Elevation</b>
      {trackerStatus.elevation.toFixed(1)}°
    </p>
  </div>

}



export { TrackerViewer }