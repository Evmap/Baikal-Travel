function init () {
    // Создаем карту с добавленной на нее кнопкой.
    var regenRouteObj = [];
    var placemarks = [];
    var activeMarks = [];
    var hotelmarks = [];
    var hotelRadius = 0.0001;

    window.myMap = new ymaps.Map('map', {
        center: [52.3, 104.284216],
        zoom: 7,
	controls:['zoomControl']
    }, {
        buttonMaxWidth: 300
    });

    var hotelButton = new ymaps.control.Button({
        data: { content: "Показать ближайшие отели"},
        options: { selectOnClick: true }
    });
    myMap.controls.add(hotelButton);

    var masstransitButton = new ymaps.control.Button({
        data: { content: "На общественном транспорте"},
        options: { selectOnClick: true }
    });
    myMap.controls.add(masstransitButton);

    var MRMGarr = [];
    var objects;
    var cho_objects;
    myMap.events.add('boundschange', function (event) {
	hotelsFetcher.fetch();
    });
    // $.getJSON("https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafes+in+Irkutsk&key=AIzaSyAvaYUJnJac1tf4Z8Ps0leCPcAe0RxFoHE",function( data ) {
    // 	objects = data;
    // 	alert(objects.results[0].geometry.location.lng);
    // });
    $(".btn-primary").click(function(){
        var category = $("option:selected").text();
        var query = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
            category+"+Иркутск&key=AIzaSyDzfijuIvyEJlnKJhgS__3EX9tjKMMkXZ8";
        $.ajax({
            dataType: "json",
            async: false,
            url: query,
            success: function(data) {
		for(var i = 0; i < placemarks.length; i++) {
		    myMap.geoObjects.remove(placemarks[i])
		}
		placemarks = [];
		objects=data;
		var object = objects.results;
		for(var i = 0, l = object.length; i < l; i++) {
		    var placemark = new ymaps.Placemark([object[i].geometry.location.lat,object[i].geometry.location.lng],{            iconContent: '1',hintContent: object[i].name, balloonContent: object[i].icon});
		    placemarks.push(placemark);
		    for(var i = 0; i < placemarks.length; i++) {
			myMap.geoObjects.add(placemarks[i]);
		    }
		}
	    }
        });
    });


    function regenRoute(objects){
	// Создаем модель мультимаршрута.
	var multiRouteModel = new ymaps.multiRouter.MultiRouteModel(objects, {
            // Маршрут при этом будет перестраиваться.
            boundsAutoApply: true
	});

	// Создаем кнопку, переключающую модель в режим
	// маршрутизации на общественном транспорте.

	// Объявляем обработчики для кнопки.
	masstransitButton.events.add('select', function () {
            multiRouteModel.setParams({ routingMode: 'masstransit' }, true);
	});

	masstransitButton.events.add('deselect', function () {
            multiRouteModel.setParams({ routingMode: 'auto' }, true);
	});

	hotelButton.events.add('select', function () {
        var x = 0;
        var y = 0;
        var price_low = $( "#slider" ).slider( "values", 0 );
        var price_high = $( "#slider" ).slider( "values", 1 );
        
        for (var i = 0; i < activeMarks.length; i++) {
            x += activeMarks[i][0];
            y += activeMarks[i][1];
        };

        x /= activeMarks.length;
        y /= activeMarks.length;

        for (var hotelId in hotelsList.hotels) {
            var hotel = hotelsList.hotels[hotelId];
            var dist = Math.pow(x - hotel.lat, 2) + Math.pow(y - hotel.lon, 2);
            
            if (hotelRadius > dist && hotel.price_from >= price_low && hotel.price_from <= price_high) {
                var mark = new ymaps.Placemark([hotel.lat, hotel.lon], { draggable: 0 });
                myMap.geoObjects.add(mark);
                hotelmarks.push(mark);
            }
        };
	});

	hotelButton.events.add('deselect', function () {
            for(var i = 0; i < hotelmarks.length; i++) {
		myMap.geoObjects.remove(hotelmarks[i])
            }
            hotelmarks = [];
	});


	ymaps.modules.require([
            'MultiRouteCustomView'
	], function (MultiRouteCustomView) {
            // Создаем экземпляр текстового отображения модели мультимаршрута.
            // см. файл custom_view.js
            new MultiRouteCustomView(multiRouteModel);
	});

	// Создаем на основе существующей модели мультимаршрут.
	var multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
            // Путевые точки можно перетаскивать.
            // Маршрут при этом будет перестраиваться.
            boundsAutoApply: true
	});
	return multiRoute;
    };

    $(document).on('click', '.ymaps-2-1-39-route-pin', function(){
	MRMGarr.pop();
	activeMarks.pop();
	myMap.geoObjects.remove(regenRouteObj);
	regenRouteObj = regenRoute(MRMGarr);
	myMap.geoObjects.add(regenRouteObj);
    });

    $(document).on('click', '.item', function(){
	$("#viewContainer").empty();
	var id = $( this ).attr('id');
	var object = objects.results;
	for(var i = 0, l = object.length; i < l; i++) {
	    if (object[i].id == id) {
		MRMGarr.push([object[i].geometry.location.lat,object[i].geometry.location.lng]);
		activeMarks.push([object[i].geometry.location.lat,object[i].geometry.location.lng]);
	    }
	}
	myMap.geoObjects.remove(regenRouteObj);
	regenRouteObj = regenRoute(MRMGarr);
	myMap.geoObjects.add(regenRouteObj);
    });

    hotelsFetcher.fetch();
}

ymaps.ready(init);
