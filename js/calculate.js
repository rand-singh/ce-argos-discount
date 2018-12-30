function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

var current_price = document.getElementsByClassName("product-price-primary")[0].getAttribute("content");
var current_discounted_price = document.getElementsByClassName("product-price-secondary");

if(current_price){
    var amount_deducted = calculateAmountDeducted(selected_discount, current_price);

    var discount_price = current_price - amount_deducted;

	var new_price = '<span>' + selected_discount + '% off </span>&pound;' + discount_price.toFixed(2);

	for(let x of current_discounted_price){
		x.innerHTML = new_price;
	}

} else {
	console.log('Original Price Not Found');
}
