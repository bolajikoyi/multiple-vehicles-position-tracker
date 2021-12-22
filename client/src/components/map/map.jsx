import React, { useState, useEffect } from 'react';
import ReactMapGL, {Marker, NavigationControl, Popup} from 'react-map-gl';
import './map.css';
import { DEFAULT_VIEWPORT, MAPBOX_STYLES } from './constants';
import socketIOClient from 'socket.io-client'


const Map = ()=>{
    //states
    const [viewport, setViewport] = useState(DEFAULT_VIEWPORT)
    const [mapStyle, setMapStyle] = useState(MAPBOX_STYLES['Streets'])
    const [mapStyleIcon, showMapStyle] = useState(false)
    const [showPopup, togglePopup] = useState(false);
    const [response, setResponse] = useState([]);
    const [popup, setPopup] = useState([]);

    // position setting for navigation control
    const navControlStyle = {
        bottom: 10,
        margin: '1.3rem',
        opacity: 0.85,
      };
      //Here we connect to the server
      useEffect(() => {
        const socket = socketIOClient('http://localhost:3100')
        let arr = []
        socket.on('vehicle-coordinate', data => {
            let newData = JSON.parse(data)
            console.log(newData)
            let randomColor = '#'+ Math.random().toString(16).substring(2,8);
            console.log(randomColor)
            let vehicleData = {
                lon: newData[0],
                lat: newData[1],
                id: newData[2]
            }
            
            console.log(arr)
            let objIndex = arr.findIndex(val=> val.id === vehicleData.id)
            if(objIndex > -1){
                arr[objIndex] = {...vehicleData}
            }
            else{
                arr.push({...vehicleData, color: randomColor})
            }
            setResponse([...arr])

        })
        
        return () => {
            socket.disconnect()
        }
    },[])

    return(
        <div>
            <div className="sidebar">
                Longitude: {viewport.longitude.toFixed(4)}| Latitude: {' '}
                {viewport.latitude.toFixed(4)}| Zoom: {viewport.zoom.toFixed(2)}
            </div>
            <div>{!mapStyleIcon? 
                <div className='mapStyle-icon' onClick={()=> showMapStyle(true)}><i className="fas fa-folder-open" style={{fontSize:'24px'}}></i></div> :
                <div className='mapStyle'>
                {
                    Object.entries(MAPBOX_STYLES).map((styles, index)=>{
                    return(
                        <button className={styles[1]===mapStyle? styles[0]+' active': styles[0]}
                            style={{cursor: 'pointer'}} 
                            onClick={()=>{
                                setMapStyle(styles[1])
                                showMapStyle(false)
                            }}
                            key={index}
                        >
                        {styles[0]}
                        </button>
                    )
                    })
                }
            </div>
            }</div>
            
            <ReactMapGL 
                {...viewport}
                width='100vw'
                height='100vh'
                maxZoom={20} 
                mapboxApiAccessToken="pk.eyJ1Ijoib21vYm9sYWppLWtveWkiLCJhIjoiY2txZm50eWUwMHQ1bzJxcGd1ODBxM2d1bSJ9.HTGUO42-AiI6NwJf-oZ5vw"
                onViewportChange = {(newViewPort) => {
                    setViewport({...newViewPort})
                    console.log(newViewPort)
                } }
                mapStyle={mapStyle}
            
            >
                {
                response.map((data)=>{
                    let vehicleColor = data.color
                    let longitude = data.lon
                    let latitude = data.lat
                    return(
                        <Marker key={data.id} longitude={longitude} latitude={latitude}>
                            <div className='train-marker' onClick={()=>{
                                togglePopup((val)=> !val)
                                setPopup(data)
                                }}>
                                {/* <img src={train} alt="train" style={{color: `${svgColor}`}} /> */}
                                <i className="fas fa-car fa-2x" style={{color: `${vehicleColor}`}}></i>
                            </div>
                        </Marker>
                    )
                })
                }

                {/* used when we have a lot of markers */}
                {showPopup && <Popup 
                    longitude={popup.geometry.coordinates[1]} 
                    latitude={popup.geometry.coordinates[0]}
                    closeButton = {true}
                    closeOnClick={true}
                    onClose={() => togglePopup(false)}
                    anchor = "bottom"
                >
                    <div style={{textAlign: 'left'}}>
                        <p>id: {popup.id}</p>
                        <p>Lng: {popup.geometry.coordinates[1]}</p>
                        <p>Lat: {popup.geometry.coordinates[0]}</p>
                    </div>
                </Popup>}
            <NavigationControl style={navControlStyle} />
            </ReactMapGL>

        </div>
    )
}
export default Map