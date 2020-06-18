function getSavedDiscount(savedDiscount, callback) {
	chrome.storage.sync.get(savedDiscount, (items) => {
		callback(chrome.runtime.lastError ? null : items[savedDiscount]);
	});
}
<<<<<<< Updated upstream
 
function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

function calculateNewPrice(savedDiscount){
 
  var discount_amount = savedDiscount;

  var price_containers = document.getElementsByClassName("product-price-primary");

  var current_price = price_containers[0].getAttribute("content");

  if(current_price){
      var amount_deducted = calculateAmountDeducted(discount_amount, current_price);

      var discount_price = current_price - amount_deducted;

      for(let x of price_containers){
      	x.insertAdjacentHTML("afterend","<li class='price product-price-secondary'><span>" + discount_amount + "% off </span>&pound;" + discount_price.toFixed(2) + "</li>");
	  }
    } else {
      console.log('Original Price Not Found');
    }
}

function init(){
  getSavedDiscount('discountSavedInMemory', (savedDiscount) => {
    if (savedDiscount) {
        calculateNewPrice(savedDiscount);
    } else {
      calculateNewPrice(10);
    }
  });
=======

function calculateAmountDeducted(percentageOff, currentPrice) {
	return (percentageOff / 100) * currentPrice;
}

function calculateNewPrice(savedDiscount) {
	var discount_amount = savedDiscount;

	var product_price_container = document.querySelector(
		"section.pdp-pricing-module ul li"
	);

	var current_price = product_price_container.getAttribute("content");

	if (current_price) {
		var amount_deducted = calculateAmountDeducted(
			discount_amount,
			current_price
		);

		var discount_price = current_price - amount_deducted;

		product_price_container.insertAdjacentHTML(
			"beforeend",
			"<li class='price product-price-secondary'><h2><span>" +
				discount_amount +
				"% off </span>&pound;" +
				discount_price.toFixed(2) +
				"</h2></li>"
		);
	} else {
		console.log("Original Price Not Found");
	}
}

function init() {
	getSavedDiscount("discountSavedInMemory", (savedDiscount) => {
		if (savedDiscount) {
			calculateNewPrice(savedDiscount);
		} else {
			calculateNewPrice(10);
		}
	});
>>>>>>> Stashed changes
}

document.addEventListener("DOMContentLoaded", init());
