function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

var current_price = $(".product-price-primary").attr("content");
var current_discounted_price = $(".product-price-secondary");

if(current_price){
    var amount_deducted = calculateAmountDeducted(selected_discount, current_price);

    var discount_price = current_price - amount_deducted;

    current_discounted_price.replaceWith("<li class='price product-price-secondary'><span>" + selected_discount + "% off </span>&pound;" + discount_price.toFixed(2) + "</li>");
} else {

      console.log('Original Price Not Found');

}


