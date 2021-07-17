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
      try {
        if (data) {
          setTrackerStatus(data)
        }
      } catch (err) {
        console.error(err)
      }
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
      <b className="tracker_viewer_label">Status</b>
      <span className="tracker_viewer_value">
        <span className={" " + (trackerStatus.satellite ? "tracking-active" : "tracking-idle")}> ⬤ </span>
        {trackerStatus.satellite ? 'Tracking' : trackerStatus.tracker_power ? 'Idle' : 'Off'}
      </span>

    </p>
    <p>
      <b className="tracker_viewer_label">Satellite</b>
      <span className="tracker_viewer_value">
        {trackerStatus.satellite ? trackerStatus.satellite.name : 'N/A'}
      </span>
    </p>
    <p>
      <b className="tracker_viewer_label">Azimuth</b>
      <span className="tracker_viewer_value">
        {trackerStatus.azimuth.toFixed(1)}°
      </span>

    </p>
    <p>
      <b className="tracker_viewer_label">Elevation</b>
      <span className="tracker_viewer_value">
        {trackerStatus.elevation.toFixed(1)}°
      </span>

    </p>
  </div>

}



export { TrackerViewer }