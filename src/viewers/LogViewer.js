import React from 'react'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import axios from 'axios';
import es from 'dayjs/locale/es'
import 'bulma/css/bulma.css'
dayjs.extend(LocalizedFormat)
dayjs.locale(es)

function LogViewer (props) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    axios.get('/getLogs')
      .then(res => { setRows(res.data) })
      .catch(err => { console.error(err); })
  }, [])

  useEffect(() => {
    let setter = (newrow) => {
      console.log(newrow)
      const { message } = newrow

      if (typeof message !== 'string' && !(message instanceof String)) {
        newrow.message = JSON.stringify(message, null, 2)
      }

      setRows(oldRows => [newrow, ...oldRows].slice(0, 50))
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
        <th className="">Message</th><th>Service</th></tr>
    </thead>
    <LogViewerRows rows={rows}></LogViewerRows>
    <tfoot></tfoot>
  </table></div>
}

function LogViewerRows (props) {

  let filteredRows = []
  for (let i = 0; i < props.rows.length; i++) {
    if (i === 0 || (props.rows[i].message != props.rows[i - 1].message)) {
      filteredRows.push({ ...props.rows[i] })
    } else {
      const n2 = filteredRows[filteredRows.length - 1]
      if (!n2.repeat) n2.repeat = 1
      n2.repeat++
    }
  }

  return <tbody className=" ">
    {filteredRows.map(row => <LogViewerRow key={row.uuid} {...row}></LogViewerRow>)}
  </tbody>

}
const levelsToTags = {
  debug: 'is-warning',
  error: 'is-danger',
  info: 'is-info'  
}
function LogViewerRow (props) {
  const level = levelsToTags[props.level]||""

  return <tr ><td className="nowrap">{dayjs(props.timestamp).format('L LTS')}</td>
    <td className="nowrap"><span className={`tag ${level}`}>{props.level}</span></td>
    <td className="width99"><LogViewerRepeat count={props.repeat} /> {props.message}</td>
    <td className="nowrap">{props.service}</td></tr>
}

function LogViewerRepeat (props) {
  if (props.count) {
    return <span className="tag is-danger">{props.count}</span>
  }
  return <></>
}

export { LogViewer }



