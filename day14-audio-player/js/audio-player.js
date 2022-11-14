//array of song objects
const songs = [
	{
		"name" 		: "infraction",
		"trackName" : "Ultraviolet",
		"artist" 	: "Infraction"
	},
	{
		"name" 		: "color-parade",
		"trackName" : "Boom Pop",
		"artist" 	: "Color Parade"
	},
	{
		"name" 		: "mojo",
		"trackName" : "Rebel",
		"artist" 	: "MOJO"
	}
];

//HTML elements
const playBtn = document.getElementById('play');
const previousBtn = document.getElementById('previous');
const nextBtn = document.getElementById('next');

const image = document.getElementById('cover-art');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

//the <audio> element
const audio = document.querySelector('audio');

//keep track of the state of the player
let isPlaying = false;

function playSong(){
	audio.play();
	isPlaying = true;
	//swap the button icon
	playBtn.classList.replace( 'fa-play', 'fa-pause' );
}

function pauseSong(){
	audio.pause();
	isPlaying = false;
	//swap the button icon
	playBtn.classList.replace( 'fa-pause', 'fa-play' );
}

//when we click play/pause - do the appropriate action
playBtn.addEventListener("click", function(){
	if( isPlaying ){
		pauseSong();
	}else{
		playSong();
	}

	//console.log('isPlaying: ' + isPlaying);
} );

//next/prev playlist behavior

//current song
let songIndex = 0;

function previousSong(){
	songIndex --;
	//if we're at the beginning, jump to the end
	if(songIndex < 0){
		songIndex = songs.length - 1;
	}
	//load that track!
	updateSong(songs[songIndex]);
}

function nextSong(){
	songIndex ++ ;
	//if we're at the end, jump to the beginng
	if( songIndex > songs.length - 1){
		songIndex = 0;
	}
	//load that track!
	updateSong(songs[songIndex]);	
}

function updateSong(song){
	audio.src = `music/${song.name}.mp3`;
	image.src = `img/${song.name}.jpg`;
	title.textContent = song.trackName;
	artist.textContent = song.artist;
	playSong();
}

//event listeners
previousBtn.addEventListener( "click", previousSong );
nextBtn.addEventListener( "click", nextSong );


//progress bar and audio events

function updateProgressBar(e){
	let currentTime = e.target.currentTime;
	let duration = e.target.duration;
	let progressPercent = (currentTime / duration) * 100;
	//apply it to the bar
	progress.style.width = `${progressPercent}%`;

	//duration
	let durationMinutes = Math.floor( duration / 60 );
	let durationSeconds = Math.floor( duration % 60 );
	//leading zero
	if( durationSeconds < 10 ){
		durationSeconds = `0${durationSeconds}`;
	}

	//wait for a real value before displaying to avoid NaN
	if( durationSeconds ){
		durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
	}

	//current time
	let currentMinutes = Math.floor( currentTime / 60 );
	let currentSeconds = Math.floor( currentTime % 60 );
	if(currentSeconds < 10){
		currentSeconds  = `0${currentSeconds}`;
	}

	currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

}

audio.addEventListener( 'timeupdate', updateProgressBar );

//"seek" to a timestamp when you click the progress bar

function setProgressBar(e){
	//the width of the container in px
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;
	//using a ratio, figure out what second to jump to
	audio.currentTime = ( clickX / width ) * duration;
}
progressContainer.addEventListener("click", setProgressBar);


//when the song ends, jump to the next song
audio.addEventListener( 'ended', nextSong );