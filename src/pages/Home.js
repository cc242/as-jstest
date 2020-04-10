import React, {useEffect, useRef, useState} from 'react';
import {logger} from "../services/Logging";
import {getWeather} from "../services/OpenWeatherAPI";
import PixiContainer from "../components/PixiContainer";

const Home = () => {
    const locationRef = useRef();
    const details = useRef();
    const [weather, setWeather] = useState('01d');
    const [temperature, setTemperature] = useState();
    const [location, setLocation] = useState();
    const [units, setUnits] = useState('metric');
    const handleSubmitWeather = (event) => {
        event.preventDefault();
        const location = locationRef.current.value;
        setLocation(location);
        getWeather(location, units).then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    setWeather(data.weather[0].icon);
                    setTemperature(data.main.temp + '°');
                    /**]
                     * update log
                     */
                    logger(location, data.weather[0].main, data.main.temp + '°').then((r) => {
                        console.log('logged ok', r.ok);
                    });
                } else {
                    console.log('location not found');
                }
            });
    };
    useEffect( () => {
    }, [weather]);

    useEffect( () => {
        if (temperature !== undefined) details.current.style.opacity = 1;
    }, [temperature]);

    const handleChange = (event) => {
        event.persist();
        setUnits(event.target.value)
    };

    return (
        <div className="page page--home">
            <div className="home">
                <div className="home__top">
                    <PixiContainer weather={weather}/>
                    <div ref={details} className="weather-details">
                        <div className="weather-details__location">
                            <span className="bgtext title">{location}</span>
                        </div>
                        <div className="weather-details__temperature">
                            <span className="bgtext sub">{temperature}</span>
                        </div>
                    </div>
                </div>
                <div className="home__bottom">
                    <form onSubmit={handleSubmitWeather}>
                        <input ref={locationRef} id="location" type="text" placeholder="Enter location"/>
                        <div className="radio-toolbar">
                            <input type="radio" id="radioMetric" name="radioUnits" value="metric" onChange={handleChange} defaultChecked/>
                            <label htmlFor="radioMetric">Celsius</label>
                            <input type="radio" id="radioImperial" name="radioUnits" value="imperial" onChange={handleChange}/>
                            <label htmlFor="radioImperial">Farenheit</label>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
