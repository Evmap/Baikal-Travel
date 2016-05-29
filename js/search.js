$(document).ready(function(){
    $(".btn-primary").click(function(){
	var query2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+object[i]..geometry.location.lat+'&radius='+object[i].geometry.location.lng+'&key=AIzaSyCph9jxnUXoZ_d6p0lzFG1Ihr-ZEU8WHQk";
        var query = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
            $("input").val()+"&key=AIzaSyCph9jxnUXoZ_d6p0lzFG1Ihr-ZEU8WHQk";
        $.ajax({
            dataType: "json",
            async: false,
            url: query,
            success: function(data) {
                var item_head = $(".search-result");
                $(".search-result > li").remove();

                data.results.forEach(function(value) {
                    var addr = value.formatted_address;
                    var img_src = value.icon;
                    var id = value.id;
                    var name = value.name;
                    var types = value.types;

                    item_head.append(
                        '<li class="item" id='+id+'><a href="#" class="row" id='+id+'>\
                            <img src='+img_src+' class="col-md-4 pull-left">\
                                <h5>'+name+'</h5>\
                            </img>\
                            <p class="col-md-8">'+addr+'</p>\
                        </a></li>'
                    );
                });
            }
        });
    });
});
