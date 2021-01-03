import React from 'react'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import es from 'dayjs/locale/es'
import 'bulma/css/bulma.css'
dayjs.extend(LocalizedFormat)
dayjs.locale(es)

function LogViewer(props) {
  const [rows, setRows] = useState([])
  useEffect(() => {
    let setter = (newrow) => {
      setRows(oldRows => {
        return [newrow, ...oldRows].slice(0,20)
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
    <thead className=" displayblock ">
      <tr>
        <th>Timestamp</th>
        <th>Level</th>
        <th className="width99">Message</th><th>Service</th></tr></thead>
    <LogViewerRows rows={rows}></LogViewerRows>
    <tfoot></tfoot>
  </table></div>
}

function LogViewerRows(props) {
  return <tbody className="displayblock scrollable width99">
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



