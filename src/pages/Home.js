import React, {useEffect, useRef, useState} from 'react';
import Logger from "../services/Logging";
import PixiContainer from "../components/PixiContainer";

const Home = () => {
    const locationRef = useRef();
    const details = useRef();
    const [weather, setWeather] = useState('01d');
    const [temperature, setTemperature] = useState();
    const [location, setLocation] = useState();
    const [units, setUnits] = useState('metric');
    const logger = new Logger();
    const handleSubmitWeather = (event) => {
        event.preventDefault();
        const location = locationRef.current.value;
        setLocation(location);
        fetch(`/api/weather?location=${location}&units=${units}`)
            .then(response => response.json())
            .then(data => {
                setWeather(data.weather[0].icon);
                setTemperature(data.main.temp+'°');

                /**]
                 * update log
                 */
                logger.log(location, data.weather[0].main, data.main.temp+'°');
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
        console.log('change', event.target.value);
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