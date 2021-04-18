import React from 'react'
import { useState, useEffect } from 'react'


function TrackerViewer (props) {
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


  return <div className="level is-mobile">
    <div className="level-item has-text-centered  ">
      <div>
        <p className="heading">Status</p>
        <p className="title">
          <span className={" " + (trackerStatus.satellite ? "tracking-active" : "tracking-idle")}> ⬤ </span>
          {trackerStatus.satellite ? 'Tracking' : 'Idle'}
        </p>
      </div>
    </div>


    <div className="level-item has-text-centered">
      <div>
        <p className="heading">Satellite</p>
        <p className="title">{trackerStatus.satellite ? trackerStatus.satellite.name : 'N/A'}</p>
      </div>
    </div>


    <div className="level-item has-text-centered">
      <div>
        <p className="heading">Azimuth</p>
        <p className="title">{trackerStatus.azimuth.toFixed(1)}°        </p>
      </div>
    </div>


    <div className="level-item has-text-centered">
      <div>
        <p className="heading">Elevation</p>
        <p className="title">{trackerStatus.elevation.toFixed(1)}°
        </p>
      </div>
    </div>

  </div>
}



export { TrackerViewer }