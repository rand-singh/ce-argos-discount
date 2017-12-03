function getSavedDiscount(savedDiscount, callback) {
  chrome.storage.sync.get(savedDiscount, (items) => {
    callback(chrome.runtime.lastError ? null : items[savedDiscount]);
  });
}
 
function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

function calculateNewPrice(savedDiscount){
 
  var discount_amount = savedDiscount;

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

function init(){

  getSavedDiscount('discountSavedInMemory', (savedDiscount) => {
    if (savedDiscount) {
        calculateNewPrice(savedDiscount);
    } else {
      calculateNewPrice(10);
    }
  });
}

document.addEventListener("DOMContentLoaded", init());
