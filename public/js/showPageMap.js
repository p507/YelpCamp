mapboxgl.accessToken = mapToken;
const campData = JSON.parse(campground);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // style URL (dark-v10)
    // center: [-74.5, 40], // starting position [lng, lat]
    center: campData.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campData.title}</h3>`
            )
    )
    .addTo(map)