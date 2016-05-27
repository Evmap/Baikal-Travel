var user = '{ "type": "hotel", "description": "The Best Hotel In The World", "img_url": ""}';

var map;
DG.then(function () {
    map = DG.map('map', {
        center: [52.3, 104.3],
        zoom: 13
    });
    DG.marker([52.3, 104.3]).addTo(map).bindPopup('<h2>Вы кликнули по мне!</h2>');
});
