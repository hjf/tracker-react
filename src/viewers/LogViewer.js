import React from 'react'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import axios from 'axios';
import es from 'dayjs/locale/es'
import 'bulma/css/bulma.css'
dayjs.extend(LocalizedFormat)
dayjs.locale(es)

function LogViewer(props) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    axios.get('/getLogs')
      .then(res => { setRows(res.data) })
      .catch(err => { console.error(err); })
  }, [])

  useEffect(() => {
    let setter = (newrow) => {
      setRows(oldRows => {
        return [newrow, ...oldRows].slice(0, 50)
      })
    }
    if (props.socketController)
      props.socketController.subscribe(setter, 'log')

    return () => {
      if (props.socketController)
        props.socketController.unsubscribe(setter, 'log')
    }
  }, [props.socketController])

  return <div className="logviewer"><table className="table ">
    <thead className="  ">
      <tr>
        <th>Timestamp</th>
        <th>Level</th>
        <th className="">Message</th><th>Service</th></tr></thead>
    <LogViewerRows rows={rows}></LogViewerRows>
    <tfoot></tfoot>
  </table></div>
}

function LogViewerRows(props) {
  return <tbody className=" ">
    {props.rows.map(row => <LogViewerRow key={row.timestamp} {...row}></LogViewerRow>)}
  </tbody>

}

function LogViewerRow(props) {

  return <tr><td className="nowrap">{dayjs(props.timestamp).format('L LTS')}</td>
    <td className="nowrap">{props.level}</td>
    <td className="width99">{props.message}</td>
    <td className="nowrap">{props.service}</td></tr>
}

export { LogViewer }



