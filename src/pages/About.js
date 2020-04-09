import React, {useEffect, useState} from 'react'
import Logger from "../services/Logging";
const About = () => {
    const [logItems, setLogitems] = useState([]);
    const logger = new Logger();

    useEffect(()=> {
        logger.getLog().then(response => response.json())
            .then(data => {
                setLogitems(data);
            });
    }, []);

    function PreviousSearchesList(props) {
        const logs = props.logs;
        const listItems = logs.map((log, i) =>
            <li className="logs__entry" key={i}>
                <div><h2>{log.location}</h2></div>
                <div>{log.weather}</div>
                <div>{log.temperature}</div>
            </li>
        );
        return (
            <ul>{listItems}</ul>
        );
    }

    return (
        <div className="page page--about">
            <div className="logs">
                <PreviousSearchesList logs={logItems}/>
            </div>
        </div>
    );
};

export default About;
