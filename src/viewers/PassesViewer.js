import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import dayjs from 'dayjs';


function PassesViewer(props) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  function rowClick(pass) {
    if (props.detailCallback)
      props.detailCallback(pass)
  }

  useEffect(() => {

    let setter = () => {
      axios.get('/upcomingPasses')
        .then(res => { setRows(res.data) })
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
    <PassesViewerRows rowClick={rowClick} rows={rows}></PassesViewerRows>
    <tfoot></tfoot>
  </table>

}

function PassesViewerRows(props) {
  return <tbody className="  ">
    {props.rows.map(row => <PassesViewerRow rowClick={props.rowClick} key={row.schedule_id} {...row}></PassesViewerRow>)}
  </tbody>

}

function PassesViewerRow(props) {
  const rowclass = props.run_status === 'disabled' ? 'disabledPass has-text-grey-light' : ""
  return <tr className={rowclass} onClick={(o) => props.rowClick(props)}><td className="nowrap">{dayjs(props.schedule_time).format('LT')}</td>
    <td className="nowrap">{props.action.satellite.name}</td>
    <td className="nowrap">{props.action.prediction.maxElevation.toFixed(0)}</td>
  </tr>
}

export { PassesViewer }