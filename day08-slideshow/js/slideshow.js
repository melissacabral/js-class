//get all the "nav" buttons 
const links = document.querySelectorAll('.itemLinks');
//get the slide wrapper so we can slide it
const slideWrapper = document.getElementById('slide-wrapper');
//arrows
const nextArrow = document.getElementById('nextSlide');
const previousArrow = document.getElementById('previousSlide');

//get the width of one slide
const firstSlide = document.querySelector('.slide');
let width = firstSlide.offsetWidth;

//the current slide number
let currentSlideNumber = 0;


// go through each link, make a event listener and put number data on them
for( let i = 0; i < links.length; i++ ){
	//grab one li
	const link = links[i];
	//data-attribute
	link.setAttribute( "data-number", i );

	//click event handler
	link.addEventListener('click', setClickedItem);
}

//arrow event handlers
nextArrow.addEventListener( 'click', setNextSlide );
previousArrow.addEventListener( 'click', setPrevSlide );

//autoplay
let interval = setInterval( setNextSlide, 5000 );


function setPrevSlide(){
	currentSlideNumber--;
	//if we go lower than 0, go to the end
	if( currentSlideNumber < 0 ){
		currentSlideNumber = links.length - 1;
	}
	changePosition(currentSlideNumber);
	//add active to the "bubble" that we went to 
	removeActiveLinks();
	links[currentSlideNumber].classList.add('active');
}

function setNextSlide(){
	//make the current slide number go up
	currentSlideNumber++;
	//if we go past the last slide start over on the first slide
	if( currentSlideNumber >= links.length ){
		currentSlideNumber = 0;		
	}
	changePosition(currentSlideNumber);
	//add active to the "bubble" that we went to 
	removeActiveLinks();
	links[currentSlideNumber].classList.add('active');
}

function setClickedItem(e){
	//which numbered link was clicked
	let clickedLink = e.target;
	currentSlideNumber = clickedLink.getAttribute("data-number");
	changePosition(currentSlideNumber);
	removeActiveLinks();
	clickedLink.classList.add('active');
}

//handle moving the slide wrapper
function changePosition( number ){
	let position = - ( number * width ) + 'px';
	slideWrapper.style.left = position;
}

//remove all active classes
function removeActiveLinks(){
	for( let i = 0; i < links.length; i++ ){
		links[i].classList.remove('active');
	}
}

//food for thought
//dymanically make thumbnails by cloning the slides
//map arrow keys to the arrow buttons
//make it "auto advance" using setinterval