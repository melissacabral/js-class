(function(){
//import our .json file
import catalog from "../data/data.json" assert { type: "json" };

//display each product in the page
const container = document.getElementById('container');
let productHTML = '';

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
				<span class="price">\$${product.price.toFixed(2)}</span>`
	
	//only show the sale price if on sale
	if(product.salePrice){			
		productHTML += `<span class="sale-price">\$${product.salePrice.toFixed(2)}</span>`;
	}
		
	productHTML += `<button data-productid="${product.id}" class="add-to-cart">&plus; Add to Cart</button></div>`;

}

container.innerHTML = productHTML;
})();