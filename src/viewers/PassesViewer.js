import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import dayjs from 'dayjs';


function PassesViewer(props) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {

    let setter = () => {
      axios.get('/upcomingPasses')
        .then(res => { setRows(res.data.map(x => { x.action = JSON.parse(x.action); return x })) })
        .catch(err => { console.error(err); setError(err.message) })
    }

    setter();

    if (props.socketController)
      props.socketController.subscribe(setter, 'new_schedules')

    return () => {
      if (props.socketController)
        props.socketController.unsubscribe(setter, 'new_schedules')
    }
  }, [props.socketController])

  if (error)
    return <p>Error loading passes: {error}</p>

  return <table className="table">
    <thead className="  ">
      <tr>
        <th>Time</th>
        <th>Satellite</th>
        <th>Max El</th>
      </tr>
    </thead>
    <PassesViewerRows rows={rows}></PassesViewerRows>
    <tfoot></tfoot>
  </table>

}

function PassesViewerRows(props) {
  return <tbody className="  ">
    {props.rows.map(row => <PassesViewerRow key={row.schedule_id} {...row}></PassesViewerRow>)}
  </tbody>

}

function PassesViewerRow(props) {

  return <tr><td className="nowrap">{dayjs(props.schedule_time).format('LT')}</td>
    <td className="nowrap">{props.action.satellite.name}</td>
    <td className="nowrap">{props.action.prediction.maxElevation.toFixed(0)}</td>
  </tr>
}

export { PassesViewer }