import React from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import './PassDetail.css'

dayjs.extend(LocalizedFormat)

function PassDetail (props) {
  if (!props || !props.action) return <></>
  const { satellite, prediction } = props.action

  const direction = prediction.direction === 'N' ? 'Northbound' : 'Southbound'

  return <>
    <h1 className='h1 title'>Details for pass #{props.schedule_id}</h1>
    <p><span className='label'>Satellite:</span>{satellite.name}</p>

    <div className="passDetailContainer">
      <div className="passDetailTile">
        <p><span className='label'>Pass start:</span>{dayjs(prediction.start).format('L LT')}</p>
        <p><span className='label'>Pass end:</span>{dayjs(prediction.end).format('L LT')}</p>
        <p><span className='label'>Pass duration:</span>{dayjs(prediction.end).diff(prediction.start, 'minute', true)}</p>
        <p><span className='label'>Sun elevation:</span>{prediction.sun_position.altitude.toFixed(0)}</p>
      </div>
      <div className="passDetailTile">
        <p><span className='label'>Initial Coords:</span>{prediction.startPosition.latitude.toFixed(2)}, {prediction.startPosition.longitude.toFixed(2)}º</p>
        <p><span className='label'>End Coords:</span>{prediction.endPosition.latitude.toFixed(2)}, {prediction.endPosition.longitude.toFixed(2)}º</p>
        <p><span className='label'>Direction:</span>{direction}</p>
      </div>
    </div>
  </>
}

export { PassDetail }