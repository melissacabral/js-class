//import our .json file
import catalog from "../data/data.json" assert { type: "json" };

//display each product in the page
const container = document.getElementById('container');
let productHTML = '';

//wishlist configuration
let wishlistQuantity = 0;
let wishlistContents = [];

//get the unique categories for the filter buttons
let uniqueCategories = [];

//draw the catalog from the data
for( let product of catalog ){	
	//comma-separated list of categories
	let categoriesList = product.categories.join(', ');
	let classes = '';

	//dynamic behavior for "on sale" items	
	if(product.salePrice){
		classes += 'on-sale ';
	}
	classes += product.categories.join(' ');
	productHTML += `<div class="product ${classes}">
				<img src="images/${product.image}">
				<h2>${product.name}</h2>
				<div class="categories">${categoriesList}</div>					
				<span class="price">\$${product.price.toFixed(2)}</span>`;
	
	//only show the sale price if on sale
	if(product.salePrice){			
		productHTML += `<span class="sale-price">\$${product.salePrice.toFixed(2)}</span>`;
	}		
	productHTML += `<button data-productid="${product.id}" class="add-to-wishlist">&plus; Add to Wishlist</button></div>`;

	//If this product has categories
		//go through all the categories on this product. 
			//if it's not in the unique categories list, 
				//add it to the list
	if( product.categories.length > 0 ){
		for( let cat of product.categories ){
			if( ! uniqueCategories.includes(cat) ){
				uniqueCategories.push(cat);
			}
		}
	}
}
container.innerHTML = productHTML;

//Build the wishlist UI
function buildDrawerUI(){
	let drawerHTML = `<!-- Drawer interface -->
					<input type="checkbox" name="drawer-toggle" id="drawer-toggle">
					<label for="drawer-toggle" id="drawer-toggle-label">Your Wishlist</label>

					<div id="drawer">
						<h2>Your Wishlist</h2>
						<ul id="drawer-contents">
						</ul>
					</div>
					<!-- end drawer interface -->`;
	container.insertAdjacentHTML('afterend', drawerHTML);
}

//when the user clicks a button, add to the wishlist and update the display
const buttons = document.querySelectorAll('.add-to-wishlist');
for( let button of buttons ){
	button.addEventListener( 'click', (e) => {
		//if this is the first item added, draw the UI for the wishlist
		if(wishlistContents.length == 0){
			buildDrawerUI();
		}
		//add the item to the wishlist  (data-productid="0002")
		let id = e.target.dataset.productid;
		wishlistContents.push(id);
		updateWishlist();

		//change the button to show that this item is already on the list
		e.target.classList.add('button-outline');
		e.target.innerHTML = 'Added to Wishlist';
		//remove the event listener on THIS button
		e.target.replaceWith(e.target.cloneNode(true));
	} );
}


function updateWishlist(){
	const wishlistEl = document.getElementById('drawer-contents');
	//empty out the wishlist element
	wishlistEl.innerHTML = '';
	//wishlistContents holds all the IDs
	for( let item of wishlistContents ){
		let wishlistItem = lookupProduct( item );
		wishlistEl.insertAdjacentHTML( 'beforeend', `<li>${wishlistItem.name}
										<span class="price float-right">\$${wishlistItem.price.toFixed(2)}
										</span>
									</li>` );
	}
}

//Look up the info on any product based on its ID number
////returns a product object from the catalog
function lookupProduct( id ){
	return catalog.find( product => product.id == id );
}

//Filtering by Category
setupFilterButtons();

const filterButtons = document.querySelectorAll('button.filter');
filterButtons.forEach( filter => {
	filter.addEventListener( "click", filterProducts );
} );

function filterProducts(e){
	let selectedFilter = e.target.dataset.filter;
	console.log(selectedFilter);

	//get the elements to show and hide
	let itemsToHide = document.querySelectorAll(`.product:not(.${selectedFilter})`);
	let itemsToShow = document.querySelectorAll(`.product.${selectedFilter}`);

	itemsToHide.forEach( item => {
		item.classList.add('hide');
		item.classList.remove('show');
	} );
	itemsToShow.forEach( item => {
		item.classList.add('show');
		item.classList.remove('hide');
	} );

}

function setupFilterButtons(){
	const filterContainer = document.getElementById("filter-container");
	let html = '';
	uniqueCategories.forEach( cat => {
		html += `<button class="filter button-outline" data-filter="${cat}">${cat}</button> `;
	} );
	filterContainer.insertAdjacentHTML('beforeend', html);
}
