export function urlForPeriod(period) {
const base = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/';
const map = {
    hour: 'all_hour.geojson',
    day: 'all_day.geojson',
    week: 'all_week.geojson'
};
return base + (map[period] || map.day);
}
