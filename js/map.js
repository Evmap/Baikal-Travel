function init () {
    // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [52.3, 104.284216],
        zoom: 7
    }, {
        buttonMaxWidth: 300
    });
    var MRMGarr = [];
    var objects;
    var cho_objects;
    // $.getJSON("https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafes+in+Irkutsk&key=AIzaSyAvaYUJnJac1tf4Z8Ps0leCPcAe0RxFoHE",function( data ) {
    // 	objects = data;
    // 	alert(objects.results[0].geometry.location.lng);
    // });
    $(".btn-primary").click(function(){
        var query = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
            $("input").val()+"&key=AIzaSyAvaYUJnJac1tf4Z8Ps0leCPcAe0RxFoHE";
        $.ajax({
            dataType: "json",
            async: false,
            url: query,
            success: function(data) {
		objects=data;
		var object = objects.results;
		var MRMGarr = [];
		for(var i = 0, l = object.length; i < l; i++) {
		    MRMGarr.push([object[i].geometry.location.lat,object[i].geometry.location.lng]);
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
	var masstransitButton = new ymaps.control.Button({
            data: { content: "На общественном транспорте"},
            options: { selectOnClick: true }
	});

	// Объявляем обработчики для кнопки.
	masstransitButton.events.add('select', function () {
            multiRouteModel.setParams({ routingMode: 'masstransit' }, true);
	});

	masstransitButton.events.add('deselect', function () {
            multiRouteModel.setParams({ routingMode: 'auto' }, true);
	});

	myMap.controls = [masstransitButton];
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

    $(document).on('click', '.item', function(){
	var id = $( this ).attr('id');
	var object = objects.results;
	for(var i = 0, l = object.length; i < l; i++) {
	    if (object[i].id == id) {
		MRMGarr.push([object[i].geometry.location.lat,object[i].geometry.location.lng]);
	    }	
	}
	myMap.geoObjects.add(regenRoute(MRMGarr));
    });
}

ymaps.ready(init);
