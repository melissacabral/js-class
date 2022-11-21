const video = document.querySelector('.camera-image');
const canvas = document.querySelector('.filtered-photo');
const ctx = canvas.getContext( '2d', { willReadFrequently:true } );
const filterButtons = document.querySelectorAll('button.filter');
const takePhotoButton = document.getElementById('take-photo');
const photoStrip = document.querySelector('.photo-strip');
let filter = 'none';

//put the original video in the preview box
getVideo();

//as soon as the video is playable, copy the feed to the canvas so we can filter it
video.addEventListener("canplay", () => { paintToCanvas() } );

//filter buttons
for( let button of filterButtons ){
	button.addEventListener("click", (e) => {
		//data-filter="something"
		filter = e.target.dataset.filter;
	});
};

//take photo button
takePhotoButton.addEventListener("click", takePhoto);


//----------------- FUNCTIONS

//get the video feed from the camera
function getVideo(){
	navigator.mediaDevices.getUserMedia( { video: true, audio: false } )
	.then( localMediaStream => {
		//console.log(localMediaStream)
		video.srcObject = localMediaStream;
		video.play();
	} )
	.catch( err => {
		console.log('oops, no stream');
	} )
}

function paintToCanvas(){
	//width and height of original video
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;

	//draw the image every 30 ms
	return setInterval( () => {
		ctx.drawImage(video, 0, 0, width, height);

		//filtering stuff!
		//take the pixels out so we can mess with them
		let pixels = ctx.getImageData( 0, 0, width, height );
		//apply the filter function
		switch( filter ){
			case 'grayscale':
				grayscale(pixels);
			break;
			case 'split':
				rgbSplit(pixels);
			break;
			//3rd party image filter script
			case 'mosaic':
				pixels = ImageFilters.Mosaic( pixels, 15 );
			break;
			case 'solarize':
				pixels = ImageFilters.Solarize( pixels );
			break;
			case 'twirl':
				pixels = ImageFilters.Twril( pixels, .5, .5, height / 2, 360 );
			break;
		}

		//put the pixels back on the canvas
		ctx.putImageData(pixels, 0, 0);

	}, 30 );	
}

//example filter from wes bos
function rgbSplit(pixels) {
	for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
}
return pixels;
}
//https://web.dev/canvas-imagefilters/
function grayscale(pixels) {
	var d = pixels.data;
	for (var i=0; i<d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
	// CIE luminance for the RGB
	// The human eye is bad at seeing red and blue, so we de-emphasize them.
	var v = 0.2126*r + 0.7152*g + 0.0722*b;
	d[i] = d[i+1] = d[i+2] = v
}
return pixels;
};

function takePhoto(){
	//get the data from the canvas
	//const data = canvas.toDataURL('image/jpeg');
	
	//optional watermark
	const data = watermarkedDataURL( canvas, "Woohoo! JS Class Demo!" );
	const link = document.createElement('a');
	//generate a thumbnail with an <a> tag around it
	link.href = data;
	link.setAttribute("download", "photobooth");
	link.innerHTML = `<img src="${data}">`;
	photoStrip.insertBefore(link, photoStrip.firstChild);
}

//https://stackoverflow.com/questions/26337163/adding-a-watermark-to-a-canvas-that-already-has-an-image-html5-canvas
function watermarkedDataURL(canvas,text){
    var tempCanvas=document.createElement('canvas');
    var tempCtx=tempCanvas.getContext('2d');
    var cw,ch;
    cw=tempCanvas.width=canvas.width;
    ch=tempCanvas.height=canvas.height;
    tempCtx.drawImage(canvas,0,0);
    tempCtx.font="24px Tahoma";
    var textWidth=tempCtx.measureText(text).width;
    tempCtx.globalAlpha=.50;
    tempCtx.fillStyle='white'
    tempCtx.fillText(text,cw-textWidth-10,ch-20);
    tempCtx.fillStyle='black'
    tempCtx.fillText(text,cw-textWidth-10+1,ch-20+2);
    return(tempCanvas.toDataURL('image/jpeg'));
}