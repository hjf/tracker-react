import { useEffect, useState } from 'react'
import SocketController from './socketController'
import { Card } from './Card'
import 'bulma/css/bulma.css'


import { PassesViewer } from './viewers/PassesViewer'
import { MapView } from './viewers/MapView'
import { LogViewer } from './viewers/LogViewer'
import { TrackerViewer } from './viewers/TrackerViewer'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import './App.css'

function App() {
  const [state, setState] = useState({ socketController: null })
  useEffect(() => {
    let socketController = new SocketController();
    setState(oldState => { return { ...oldState, socketController: socketController } })
  }, [])
  return (
    <>
    
    <Card title="Upcoming Passes" className="upcoming" >
      <PassesViewer socketController={state.socketController}></PassesViewer>
    </Card>
    <Card title="Log Viewer" className="logviewer">
      <LogViewer socketController={state.socketController}></LogViewer>
    </Card>
    <Card title="Tracker" className="trackervierwer">
      <TrackerViewer socketController={state.socketController}/>
    </Card>
    <div className="section">
    <MapView></MapView>
    </div>
    </>

  );
}

export default App;
