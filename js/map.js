$(document).ready(function(){
    ymaps.ready(init);
    var objects = '{ \
"content":[ \
{"type": "sight", "description": "Московские ворота", "img_url": "http://www.irkutsk.lusya.com/upload/catalog/ru/3496/13223927455.jpg","address": "a","longitude" : 52.293558, "latitude" : 104.28617}, \
{"type": "sight", "description": "Собор Богоявления Господня", "img_url": "https://media-cdn.tripadvisor.com/media/photo-p/0b/65/3d/fc/photo1jpg.jpg", "address": "f","longitude" :52.292313, "latitude" : 104.282678}, \
{"type": "museum", "description": "Иркутский Краеведческий музей", "img_url": "https://media-cdn.tripadvisor.com/media/photo-s/07/c1/01/00/caption.jpg","address": "f", "longitude" :52.281766, "latitude" : 104.284216}\
]\
}';
    objects = JSON.parse(objects);
    
    var myMap;
    var routeTool =true;
    function init(){     
	myMap = new ymaps.Map("map", {
            center: [52.3, 104.3],
            zoom:13
	});
	// ymaps.route([
	//     'Иркутск, Карла Маркса, 1',
	//     'улица Советская, 1, Россия, Иркутск'// или [59.956084, 30.356849]
	// ],{
	//     multiRoute: true,
	//     routingMode:"masstransit"}).then(
	// 	function (route) {
	// 	    myMap.geoObjects.add(route);
	// 	    alert(route.getHumanJamsTime());
	// 	},
	// 	function (error) {
	// 	    alert("Возникла ошибка: " + error.message);
	// 	}
	//     );
    };
    
    $("#l1").click(function(){
	var myPlacemark0 = new ymaps.Placemark([objects.content[0].longitude, objects.content[0].latitude], { hintContent: objects.content[0].description, balloonContent: objects.content[0].description + '<img style = "width:100px;" src = "'+objects.content[0].img_url + '">' });
	if (routeTool == true){	    
	    myMap.geoObjects.add(myPlacemark0);    
	};
    });

    $("#l2").click(function(){
	var myPlacemark1 = new ymaps.Placemark([objects.content[1].longitude, objects.content[1].latitude], { hintContent: objects.content[1].description, balloonContent: objects.content[1].description + '<img style = "width:100px;" src = "'+objects.content[1].img_url + '">' });
	if (routeTool == true){
	    myMap.geoObjects.add(myPlacemark1);
	};
    });

    $("#l3").click(function(){
	var myPlacemark2 = new ymaps.Placemark([objects.content[2].longitude, objects.content[2].latitude], { hintContent: objects.content[2].description, balloonContent: objects.content[2].description + '<img style = "width:100px;" src = "'+objects.content[2].img_url + '">' });
	if (routeTool == true){
	    myMap.geoObjects.add(myPlacemark2);  
	};
    });

    $("#l4").click(function(){
	ymaps.route([
	    [objects.content[0].longitude,objects.content[0].latitude],
	    [objects.content[1].longitude,objects.content[1].latitude],
	    [objects.content[2].longitude,objects.content[2].latitude]
	],{
	    multiRoute: true,
	    routingMode:"masstransit"}).then(
		function (route) {
		    myMap.geoObjects.add(route);
		},
		function (error) {
		    alert("Возникла ошибка: " + error.message);
		}
	    );
	if (routeTool == true) {
	    routeTool = false;
	}
	else{
	    routeTool = true;    
	};
    });
});
