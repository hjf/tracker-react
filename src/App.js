import { useEffect, useState } from 'react'
import SocketController from './socketController'
import 'bulma/css/bulma.css'
import { Transition } from 'react-transition-group' // ES6
import { PassesViewer } from './viewers/PassesViewer'
import { MapView } from './viewers/MapView'
import { LogViewer } from './viewers/LogViewer'
import { TrackerViewer } from './viewers/TrackerViewer'

import { PassDetail } from './viewers/PassDetail'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import './App.css'


const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0,  height:0},
  exited: { opacity: 0, visibility: 'hidden', height:0 },
};


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
        <div className="column is-full">
          <div className="">
            <MapView selectedPass={selectedPass}></MapView>
          </div>
          <section className="">
            <div className="container has-background-light trackerViewer">
              <h1 className="">Tracker</h1>
              <TrackerViewer socketController={state.socketController} />
            </div>
          </section>
          <Transition in={selectedPass == null} timeout={150}>
            {xxx => (
              <div style={{
                ...defaultStyle,
                ...transitionStyles[xxx]
              }}>
                <section key="b" className="">
                  <div className="container">
                    <h1 className="">Upcoming Passes</h1>
                    <div className="upcoming" >
                      <PassesViewer detailCallback={setSelectedPass} socketController={state.socketController}></PassesViewer>
                    </div>
                  </div>
                </section></div>
            )}
          </Transition>
          <Transition in={selectedPass != null} timeout={150}>
            {xxx => (
              <div style={{
                ...defaultStyle,
                ...transitionStyles[xxx]
              }}>
                <section key="a" className="">
                  <div className="container">
                    <PassDetail parentCallback={setSelectedPass} {...selectedPass} />
                  </div>
                </section>
              </div>
            )}
          </Transition>

        </div>

        <div className="column">




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
