$(document).ready(function(){
    $(".btn-primary").click(function(){
        var query = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
            $("input").val()+"&key=AIzaSyAvaYUJnJac1tf4Z8Ps0leCPcAe0RxFoHE";
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
