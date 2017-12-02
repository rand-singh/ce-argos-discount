 
function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

function calculateNewPrice(){
  var discount_amount = 10;

  var product_price_container = $(".product-price-primary");

  var current_price = product_price_container.attr("content");

  if(current_price){
      var amount_deducted = calculateAmountDeducted(discount_amount, current_price);

      var discount_price = current_price - amount_deducted;

      product_price_container.after("<li class='price product-price-secondary'><span>" + discount_amount + "% off </span>&pound;" + discount_price.toFixed(2) + "</li>");

    } else {

      console.log('Original Price Not Found');

    }
}

document.addEventListener("DOMContentLoaded", calculateNewPrice());
