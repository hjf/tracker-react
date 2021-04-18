import { useEffect, useState } from 'react'
import SocketController from './socketController'
import 'bulma/css/bulma.css'


import { PassesViewer } from './viewers/PassesViewer'
import { MapView } from './viewers/MapView'
import { LogViewer } from './viewers/LogViewer'
import { TrackerViewer } from './viewers/TrackerViewer'

import { PassDetail } from './viewers/PassDetail'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import './App.css'

function App () {
  const [state, setState] = useState({ socketController: null })
  const [logViewerExpanded, setLogViewerExpanded] = useState(false);

  const [selectedPass, setSelectedPass] = useState(null);
  const toggleState = () => {
    setLogViewerExpanded(e => !e);
  }
  useEffect(() => {
    let socketController = new SocketController();
    setState(oldState => { return { ...oldState, socketController: socketController } })
  }, [])
  return (
    <>
      <div className="columns">
        <div className="column is-three-quarters">
          <div className="">
            <MapView selectedPass={selectedPass}></MapView>
          </div>

          <section className="">
            <div className="container">
              <PassDetail {...selectedPass} />
            </div>
          </section>


          <section className="">

          </section>
        </div>

        <div className="column">
          <section className="">
            <div className="container">
              <h1 className="title">Upcoming Passes</h1>
              <div className="upcoming" >
                <PassesViewer detailCallback={setSelectedPass} socketController={state.socketController}></PassesViewer>
              </div>
            </div>
          </section>

          <section className="">

            <div className="container">
              <h1 className="title">Tracker</h1>

              <TrackerViewer socketController={state.socketController} />
            </div>
          </section>

        </div>

      </div>
      <div className="logViewerContainer" aria-expanded={logViewerExpanded}>
        <h1 className="title">Log Viewer</h1>
        <button className="toggler" onClick={toggleState}>*</button>
        <div className="logViewerDetail">
          <LogViewer socketController={state.socketController}></LogViewer>
        </div>
      </div>


    </>

  );
}

export default App;
