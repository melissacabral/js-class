const notesContainer = document.getElementById('notes');
const addButtonEl = document.getElementById('add-note');
let localNotes;


//load the notes if localstorage is available, otherwise show an error
if( localStorageSupport() ){
	//local storage is available!
	localNotes = JSON.parse( localStorage.getItem('notes') );
	makeNotes();
}else{
	//show an error
	const errorEl = document.getElementById('error');
	errorEl.style.display = 'block';
	errorEl.innerText = 'Sorry, your browser doesn\'t support local storage.';
}

//add a blank note when the button is clicked
addButtonEl.addEventListener("click", function(){
	oneNote('', true, randomColor());
});

//clear button - delete local storage and recreate the notes
document.getElementById("clear-notes").addEventListener( "click", function(){
	window.localStorage.clear();
	localNotes = null;
	notesContainer.innerHTML = '';
	makeNotes();
} );

//listen for any change on any note before saving
document.addEventListener('change', function(e){
	if(e.target.matches('.note-content')){
		saveNotes();
	}
});

//listen for any click so we can hear dynamic delete buttons
document.addEventListener( 'click', function(e){
	if(e.target.matches('.delete-note')){
		//remove the note node
		e.target.parentElement.remove();
		//re-save the local data
		saveNotes();
	}
} );

//======== FUNCTIONS

//draw one empty note on the screen
function oneNote( body = '', isDefault = false, color = 'yellow' ){
	let placeholder;
	if(isDefault){
		placeholder = 'Type your note here...';
	}
	let html = `<section class="note ${color}" data-color="${color}">
			<span class="delete-note">&times;</span>
			<textarea class="note-content" placeholder="${placeholder}">${body}</textarea>
		</section>`;
	notesContainer.insertAdjacentHTML('beforeend', html);
}

//save JSON data from all the notes on the screen
function saveNotes(){
	//empty array to hold all the notes
	let data = [];
	//get all the note elements
	noteEls = document.querySelectorAll('.note');
	for( note of noteEls ){
		let body = note.querySelector('textarea').value;
		let color = note.dataset.color;
		data.push({ "body" : body ,"color": color});
	}	
	//console.log(data);
	// save the notes locally!
	window.localStorage.setItem( 'notes', JSON.stringify(data) );
}

//draw all the notes based on the data in localstorage
function makeNotes(){
	if( localNotes != null ){
		for(note of localNotes){
			oneNote( note.body, false, note.color );
		}
	}else{
		//show one default empty note
		oneNote( '', true );
	}
}

//random colors every time
function randomColor(){
    let colors = ['yellow', 'orange', 'blue'];
    let random = Math.round(Math.random()*3);
    return colors[random];
}

//test if this browser supports localStorage
function localStorageSupport(){
	if( typeof(Storage) !== "undefined" ){
		return true;
	}else{
		return false;
	}
}

//FOOD FOR THOUGHT
//Make the notes re-arrangeable