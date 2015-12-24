$(function() {

	$.get('/tweets', function(data){
		console.log(data);

		for(var i = 0; i < data.urls.length; i++){
			var url = data.urls[i];
			var string = "<li><a href='#''><img src='" + url + "'/></a></li>";
			$('#ri-grid ul').append(string);
		}

		$( '#ri-grid' ).gridrotator( {
			rows : 2,
			columns : 5,
			maxStep : 1,
			interval : 2000,
			w1024 : {
				rows : 5,
				columns : 6
			},
			w768 : {
				rows : 5,
				columns : 5
			},
			w480 : {
				rows : 4,
				columns : 2
			},
			w320 : {
				rows : 4,
				columns : 2
			},
			w240 : {
				rows : 4,
				columns : 2
			},
			slideshow : true,
			onhover : true,
			animType: 'fadeInOut',
			animSpeed: 600
		} );
	});

	

});