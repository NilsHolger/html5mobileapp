var hideShow = function(event){
	var eventTarget = $(event.target);
	var data = eventTarget.data();
	$('.view').removeClass('active');
	$(data.target).addClass('active');
	renderTemplate(data.target, data.item);
};

var renderTemplate = function(target, itemId){
	var targetTemplate = target + "-template";
	var source = $(targetTemplate).html();
	var template = Handlebars.compile(source);
	//var dataList = {data: data};
   //var data = {title: "The title is here", body: "She has a sexy body"};
   var dataList;
   if (itemId){
   	var array = $.grep(marathons, function(marathon, i){
   		return marathon.id == itemId;
   	});
   	dataList = array[0];
   }
   else {
   	dataList = {data: marathons};
   }
   var html = template(dataList);
   $(target).html(html);
};

$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function(){
		if (o[this.name] !== undefined){
			if(!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}

var saveEntry = function(result){
		var highestId = Math.max.apply(Math, marathons.map(function(o){return o.id;}));
		result.id = highestId > 0 ? highestId + 1 : 1;
		marathons.push(result);
		localStorage.marathons = JSON.stringify(marathons);
};

var editEntry = function(result){
		var resultInt = parseInt(result.id);
		result.id = resultInt;
		for (i in marathons){
			if (marathons[i].id === resultInt){
				marathons[i] = result;
				localStorage.marathons = JSON.stringify(marathons);
				break;
			}
		}	
};

navigator.getUserMedia =
navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia 
|| navigator.msGetUserMedia || false;

var localMediaStream;
var fallback = function(){
	alert('fallback here');
}
var accessCamera = function(data){
		if (navigator.getUserMedia){
			navigator.getUserMedia(
			{video: true},
			function(stream){
				var video = document.querySelector('#' + data + 'video');
				video.src = window.URL.createObjectURL(stream);
				localMediaStream = stream;
				var cameraTemplate = '#' + data + 'photo';
			    renderTemplate(cameraTemplate);
			    $('.access-camera').hide();
			}, fallback
			);
			var cameraTemplate = '#' + data + 'photo';
			renderTemplate(cameraTemplate);
			$('.access-camera').hide();
		}
		else {
			alert('no camera support');
		}
};

var shootPhoto = function(data){
	var canvas = document.querySelector('#' + 'data' + 'photocanvas');
	var ctx = canvas.getContext('2d');
	var video = document.querySelector('#' + data + 'video');
	if (localMediaStream){
		ctx.drawImage(video, 0, 0);
		var canvasData = canvas.toDataUrl('image/webp');
		document.querySelector('#' + data + 'photoimage').src = canvasData;
		document.querySelector('#' + data + 'photoinput').value = canvasData;
	}
};

$('body').on('click', '.switchview', function(event){
	hideShow(event);
});

$('body').on('submit', '#addform', function(event){
	var result = $(this).serializeObject();
	saveEntry(result);
	renderTemplate("#fulllist");
	return false;
});
$('body').on('submit', '#editform', function(event){
	var result = $(this).serializeObject();
	editEntry(result);
	renderTemplate("#fulllist");
	return false;
});
$('body').on('click', '.access-camera', function(){
	var data = this.dataset.camera;
	accessCamera(data);
});
$('body').on('click', '.shoot', function(){
	var data = this.dataset.camera;
	shootPhoto(data);
});
var marathons;
if (Modernizr.localstorage){
	if (localStorage.marathons){
		marathons = JSON.parse(localStorage.marathons);
	} else {
		var marathons = [
		{
			"id": "1",
			"title": "Berlin Marathon",
			"description": "The fastest course in the world",
			"image": null,
			"location": {"latitude": 100, "longitude": 100}
		},
		{
			"id": "2",
			"title": "Boston Marathon",
			"description": "The oldest and moste prestigeous marathon in the US",
			"image": null,
			"location": {"latitude": 57, "longitude": 122}
		},
		{
			"id": "3",
			"title": "Tokio Marathon",
			"description": "Fast course, excellent organization, recent Marathon Major",
			"image": null,
			"location": {"latitude": 97, "longitude": 33}
		}
		];
	}
} else {
	console.log('Your browser does not support local storage');
}



renderTemplate("#fulllist");

