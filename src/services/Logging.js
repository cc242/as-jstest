export const logger = (location, weather, temperature) => {
    console.log('Logger: log', location, weather, temperature);
    return fetch(`/api/log?location=${location}&weather=${weather}&temperature=${temperature}`)
};
export const getLogs = () => {
    console.log('Logger: getLogs');
    return fetch(`/api/getlog`)
}
