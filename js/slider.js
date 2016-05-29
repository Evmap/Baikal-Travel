$( "#slider" ).slider({
    range: true,
    min: 100,
    max: 10000,
    values: [ 300, 700 ],
    slide: function( event, ui ) {
        $( "#amount" ).val( "RUB" + ui.values[ 0 ] + " - RUB" + ui.values[ 1 ] );
    }
});

$( "#amount" ).val( "RUB" + $( "#slider" ).slider( "values", 0 ) +
    " - RUB" + $( "#slider" ).slider( "values", 1 ) );