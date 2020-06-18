/**
 *
 * @param {*} percentageOff
 * @param {*} currentPrice
 */
function calculateAmountDeducted(percentageOff, currentPrice) {
	return (percentageOff / 100) * currentPrice;
}

var current_price = document.querySelector("section.pdp-pricing-module ul li").getAttribute("content");

if (current_price) {
	var amount_deducted = calculateAmountDeducted(
		selected_discount,
		current_price
	);

	var discount_price = current_price - amount_deducted;

	document.querySelector('.product-price-secondary').innerHTML =
		"<h2><span>" +
			selected_discount +
			"% off </span>&pound;" +
			discount_price.toFixed(2) +
			"</h2>"	;
} else {
	console.log("Original Price Not Found");
}
