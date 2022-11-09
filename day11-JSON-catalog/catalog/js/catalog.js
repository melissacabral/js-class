//import our .json file
import catalog from "../data/data.json" assert { type: "json" };

//display each product in the page
const container = document.getElementById('container');
let productHTML = '';

//wishlist configuration
let wishlistQuantity = 0;
let wishlistContents = [];




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

/* Filtering additions */
/* https://codepen.io/vskand/pen/MWKKKYK?editors=0110 */

//get the filter buttons
const filters = document.querySelectorAll('.filter');

filters.forEach(filter => { 
  filter.addEventListener('click', function() {
    let selectedFilter = filter.getAttribute('data-filter');
    
    //active tab
    //remove all active filters
    document.querySelectorAll('.filter.active').forEach( el => {
    	el.classList.remove('active');
    } );
    filter.classList.add('active');
    
    //deal with showing/hiding the correct items
    let itemsToHide = document.querySelectorAll(`.product:not(.${selectedFilter})`);
    let itemsToShow = document.querySelectorAll(`.product.${selectedFilter}`);

    if (selectedFilter == 'all') {
      itemsToHide = [];
      itemsToShow = document.querySelectorAll('.product');
    }

    itemsToHide.forEach(el => {
      el.classList.add('hide');
      el.classList.remove('show');
    });

    itemsToShow.forEach(el => {
      el.classList.remove('hide');
      el.classList.add('show'); 
    });

  });
});