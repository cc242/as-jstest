
class Logger {
    log(location, weather, temperature) {
        console.log('logging', location, weather, temperature);
        fetch(`/api/log?location=${location}&weather=${weather}&temperature=${temperature}`)
            .then(response => response.json())
            .then(data => {

            });
    }
    getLog() {
        return fetch(`/api/getlog`)
    }
}
export default Logger;
