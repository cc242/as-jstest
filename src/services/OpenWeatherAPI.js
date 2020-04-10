export const getWeather = (location, units) => {
    console.log(`OpenWeatherAPI: getWeather ${location}&units=${units}`);
    return fetch(`/api/weather?location=${location}&units=${units}`)
};
