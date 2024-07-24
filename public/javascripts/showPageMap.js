maptilersdk.config.apiKey = maptilerApiKey;
const mapContainer = document.getElementById('show-map')
const map = new maptilersdk.Map({
  container: mapContainer,
  style: maptilersdk.MapStyle.BASIC,
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
