import React from 'react'
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import { GeodesicLine } from 'leaflet.geodesic/dist/leaflet.geodesic'
import { divIcon, marker } from 'leaflet';
// import  GeodesicLine  from 'react-leaflet-geodesic'
import { useState, useEffect } from 'react'
import axios from 'axios';
import jspredict from 'jspredict'

function getMarkers (satellites) {
  return satellites.map(sat => {
    return {
      name: sat.name,
      catalog_number: sat.catalog_number,
      observation: jspredict.observe(sat.tle, null)
    }
  })
}



function MapView (props) {
  const [home, setHome] = useState([0, 0]);
  const [satellites, setSatellites] = useState([]);
  const [mapInstance, setMapInstance] = useState(null)
  const [geodesicLine, setGeodesicLine] = useState(null)
  const [passStartEnd, setpassStartEnd] = useState(null)

  useEffect(() => {
    axios.get('/getGroundStationLocation')
      .then(res => setHome([res.data.lat, res.data.lon]))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    axios.get('/getSatellites')
      .then(res => setSatellites(res.data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setGeodesicLine(oldGeodesicLine => {
      if (oldGeodesicLine && mapInstance)
        oldGeodesicLine.remove(mapInstance)

      if (props.selectedPass && mapInstance) {
        const { startPosition, endPosition } = props.selectedPass.action.prediction;
        const startEnd = [[startPosition.latitude, startPosition.longitude], [endPosition.latitude, endPosition.longitude]];
        setpassStartEnd(startEnd)
        const gl = new GeodesicLine(startEnd)
        gl.addTo(mapInstance)
        return gl
      }
    })
  }, [props.selectedPass, mapInstance])


  return <MapContainer
    whenCreated={i => { setMapInstance(i) }}
    center={home} zoom={1} className="leaflet-container">

    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
    <HomeMarker position={home} />
    <SunMarker></SunMarker>
    <SatMarkers satellites={satellites}></SatMarkers>
    {props.selectedPass &&passStartEnd && <Marker position={passStartEnd[0]} icon={divIcon({ html: "🟢", })} />}
    {props.selectedPass &&passStartEnd && <Marker position={passStartEnd[1]} icon={divIcon({ html: "🔴", })} />}

  </MapContainer >

}

function SatMarkers (props) {
  const [satMarkers, setSatMarkers] = useState([])
  useEffect(() => {
    setSatMarkers(getMarkers(props.satellites))

    let ih = setInterval(() => {
      setSatMarkers(getMarkers(props.satellites))
    }, 1000);

    return () => { clearInterval(ih) }
  }, [props.satellites])
  return satMarkers.map((marker) => { return <SatMarker {...marker} key={marker.catalog_number}></SatMarker> })
}


function SatMarker (props) {
  const customMarkerIcon = divIcon({
    html: "<p>🛰️</p><p className=\"satname\">" + props.name + "</p>",
  });
  const position = [props.observation.latitude, props.observation.longitude];
  return <><Marker
    position={position}
    icon={customMarkerIcon} >
    <Popup>
      <p>{props.name}</p>
    </Popup>

  </Marker>
  </>
}

function HomeMarker (props) {
  const customMarkerIcon = divIcon({ html: "📡", });
  return <Marker {...props} icon={customMarkerIcon} />
}

function SunMarker (props) {
  const [sunPosition, setSunPosition] = useState([0, 0])
  useEffect(() => {
    setSunPosition(getsunpos());

    let ih = setInterval(() => {
      setSunPosition(getsunpos());
    }, 60000);

    return () => { clearInterval(ih) }
  }, [])
  const customMarkerIcon = divIcon({ html: "☀️", });
  return <Marker position={sunPosition} icon={customMarkerIcon} />
}

//http://www.ne.jp/asahi/hamradio/je9pel/sunpos.js
function getsunpos () {
  let date = new Date();
  let rad = 0.017453292519943295;
  // based on NOAA solar calculations
  let mins_past_midnight = (date.getUTCHours() * 60 + date.getUTCMinutes()) / 1440;
  let jc = (((date.getTime() / 86400000.0) + 2440587.5) - 2451545) / 36525;
  let mean_long_sun = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
  let mean_anom_sun = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
  let sun_eq = Math.sin(rad * mean_anom_sun) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + Math.sin(rad * 2 * mean_anom_sun) * (0.019993 - 0.000101 * jc) + Math.sin(rad * 3 * mean_anom_sun) * 0.000289;
  let sun_true_long = mean_long_sun + sun_eq;
  let sun_app_long = sun_true_long - 0.00569 - 0.00478 * Math.sin(rad * 125.04 - 1934.136 * jc);
  let mean_obliq_ecliptic = 23 + (26 + ((21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813)))) / 60) / 60;
  let obliq_corr = mean_obliq_ecliptic + 0.00256 * Math.cos(rad * 125.04 - 1934.136 * jc);
  let lat = Math.asin(Math.sin(rad * obliq_corr) * Math.sin(rad * sun_app_long)) / rad;
  let eccent = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
  let y = Math.tan(rad * (obliq_corr / 2)) * Math.tan(rad * (obliq_corr / 2));
  let rq_of_time = 4 * ((y * Math.sin(2 * rad * mean_long_sun) - 2 * eccent * Math.sin(rad * mean_anom_sun) + 4 * eccent * y * Math.sin(rad * mean_anom_sun) * Math.cos(2 * rad * mean_long_sun) - 0.5 * y * y * Math.sin(4 * rad * mean_long_sun) - 1.25 * eccent * eccent * Math.sin(2 * rad * mean_anom_sun)) / rad);
  let true_solar_time = (mins_past_midnight * 1440 + rq_of_time) % 1440;
  let lng = -((true_solar_time / 4 < 0) ? true_solar_time / 4 + 180 : true_solar_time / 4 - 180);
  return [lat, lng]
}
export { MapView }