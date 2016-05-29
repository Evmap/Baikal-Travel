function init () {
    // Создаем карту с добавленной на нее кнопкой.
    var regenRouteObj = [];
    var placemarks = [];
    var myMap = new ymaps.Map('map', {
        center: [52.3, 104.284216],
        zoom: 7,
	controls:['zoomControl']
    }, {
        buttonMaxWidth: 300
    });
    var masstransitButton = new ymaps.control.Button({
        data: { content: "На общественном транспорте"},
        options: { selectOnClick: true }
    });
    myMap.controls.add(masstransitButton);
    
    var MRMGarr = [];
    var objects;
    var cho_objects;
    // $.getJSON("https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafes+in+Irkutsk&key=AIzaSyAvaYUJnJac1tf4Z8Ps0leCPcAe0RxFoHE",function( data ) {
    // 	objects = data;
    // 	alert(objects.results[0].geometry.location.lng);
    // });
    $(".btn-primary").click(function(){
        var query = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
            $("input").val()+"&key=AIzaSyCph9jxnUXoZ_d6p0lzFG1Ihr-ZEU8WHQk";
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
		    var placemark = new ymaps.Placemark([object[i].geometry.location.lat,object[i].geometry.location.lng],{hintContent: object[i].name, balloonContent: object[i].icon});
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
	myMap.geoObjects.remove(regenRouteObj);
	regenRouteObj = regenRoute(MRMGarr);
	myMap.geoObjects.add(regenRouteObj);
    });

    $(document).on('click', '.item', function(){
	var id = $( this ).attr('id');
	var object = objects.results;
	for(var i = 0, l = object.length; i < l; i++) {
	    if (object[i].id == id) {
		MRMGarr.push([object[i].geometry.location.lat,object[i].geometry.location.lng]);
	    }	
	}
	myMap.geoObjects.remove(regenRouteObj);
	regenRouteObj = regenRoute(MRMGarr);
	myMap.geoObjects.add(regenRouteObj);
    });
}

ymaps.ready(init);
