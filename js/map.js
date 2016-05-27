var user = '{ "type": "hotel", "description": "The Best Hotel In The World", "img_url": ""}';

var map, hotelIcon;
DG.then(function () {
    map = DG.map('map', {
        center: [52.3, 104.3],
        zoom: 13
    });
    hotelIcon = DG.icon({
      iconUrl: '/images/map-marker-hotel.png',
      iconRetinaUrl: '/images/map-marker-hotel.png',
      iconSize: [24, 34],
      iconAnchor: [12, 34]
    });
    DG.marker([52.3, 104.3]).addTo(map).bindPopup('<h2>Вы кликнули по мне!</h2>');
    map.on('moveend', function(event) {
      hotelsFetcher.fetch();
    });
    hotelsFetcher.fetch();

});


var hotelsFetcher = {
  loading: false,
  waiting: false,
  limit: 1000,
  fetch: _.debounce(function(lastId) {
    var self = this;

    bounds = map.getBounds().toBBoxString().split(',');
    bounds = '((' + bounds[1] + ',' + bounds[0] + '),(' + bounds[3] + ',' + bounds[2] + '))';
    var link = 'https://yasen.hotellook.com/tp/v1/hotels_in_bounds.json?bounds='+ bounds + '&last_id=' + (lastId || '0') + '&locale=ru';

    if(this.loading){
      this.waiting = link;
    } else {
      console.log('request', lastId);
      this.loading = true;
      $.get(this.waiting || link, function(data) {
        console.log(data.length, data.length >= self.limit);
        var lastId = hotelsList.push(data);
        self.loading = false;
        if(self.waiting){self.fetch();}
        if(data.length >= self.limit){self.fetch(lastId);}
      })
      this.waiting = false;
    }
  }, 500)
};

var hotelsList = {
  hotels: {},
  hotelIds: [],
  push: function(hotels) {
    var hotel = false;
    for(var i = 0; i < hotels.length; i++) {
      hotel = hotels[i];
      var id = hotel.id;
      if(!hotels[hotel.id]){
        DG.marker([hotel.lat, hotel.lon],{icon: hotelIcon}).addTo(map).bindPopup('<img src="https://photo.hotellook.com/image_v2/crop/h' + hotel.id + '/120.auto" width="60px" height="60px"/><a href="https://hotellook.com' + hotel.link + '?locale=ru&marker=00001" target="_blank" style="color: #fff;">Забронировать</a>');
        this.hotels[hotel.id] = hotel;
      }
    }
    console.log(hotel);
    return hotel.id || 0;
  }
};
