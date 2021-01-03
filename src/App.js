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
      <div className="columns">
        <div className="column is-three-quarters">
          <div className="section">
            <MapView></MapView>

          </div>
        </div>
        <div className="column">
          <section className="section">
            <div class="container">
              <h1 className="title">Upcoming Passes</h1>
              <div className="upcoming" >
                <PassesViewer socketController={state.socketController}></PassesViewer>
              </div>
            </div>
          </section>

          <section className="section">

            <div class="container">
              <h1 className="title">Tracker</h1>

              <TrackerViewer socketController={state.socketController} />
            </div>
          </section>

        </div>

      </div>
      <footer class="footer">
        <Card title="Log Viewer" className="logviewer">
          <LogViewer socketController={state.socketController}></LogViewer>

        </Card>
      </footer>


    </>

  );
}

export default App;
