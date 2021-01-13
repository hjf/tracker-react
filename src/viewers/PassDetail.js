import React from 'react'
import dayjs from 'dayjs'
function PassDetail(props) {
  if (!props || !props.action) return <></>
const {satellite, prediction}=props.action

return <>
    <h1 className='h1'>Details for pass #{props.schedule_id}</h1>
    <p><span className='label'>Satellite:</span>{satellite.name}</p>
    <p><span className='label'>Pass start:</span>{dayjs(prediction.start).format()}</p>
    <p><span className='label'>Pass end:</span>{dayjs(prediction.end).format()}</p>
    <p><span className='label'>Pass duration:</span>{dayjs(prediction.end).format()}</p>
    <p><span className='label'>Sun elevation:</span>{prediction.sun_position.altitude.toFixed(0)}</p>
  </>
}

export { PassDetail }