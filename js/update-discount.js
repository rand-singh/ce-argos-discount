function getCurrentTabUrl(callback) {
  const queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const id = tab.id

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, id);
  });
}

function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

function reCalculate(selected_discount) {
  const current_price = document.querySelector("section.pdp-pricing-module ul li").getAttribute("content");

  function calculateAmountDeducted(percentageOff, currentPrice){
    return (percentageOff/100) * currentPrice;
  }
  
  if (current_price) {
    var amount_deducted = calculateAmountDeducted(
      selected_discount,
      current_price
    );

    var discount_price = current_price - amount_deducted;

    if (document.querySelector('.product-price-discounted')) {
      document.querySelector('.product-price-discounted').innerHTML =
				`
					<li>
							<h2>${selected_discount}% off &pound;${discount_price.toFixed(2)}</h2>
						</li>
						<li>
							<span>saving &pound;${amount_deducted.toFixed(2)}</span>
					</li>
				`;
    }

  } else {
    console.log("Original Price Not Found");
  }
}

function calculateNewPrice(discount, tabId) {
  chrome.scripting.executeScript(
    {
      target: {tabId: tabId},
      func: reCalculate,
      args: [discount]
    },
    () => {}
  )
}

/**
 * Gets the saved discount from previous selection
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedDiscount(savedDiscount, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(savedDiscount, (items) => {
    callback(chrome.runtime.lastError ? null : items[savedDiscount]);
  });
}


/**
 * Sets the given discount for the url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveDiscount(savedDiscount) {
  var items = {};
  items['discountSavedInMemory'] = savedDiscount;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
  // console.log(items);
}

function updateInputSliderValue(value){
    document.getElementById('amount-slider').value = value;
}

function updateSliderValue(sliderValue){
    document.getElementById('range-value').innerHTML = sliderValue;
}

function updateValues(value, tabId) {
	calculateNewPrice(value, tabId);
	saveDiscount(value);
	updateSliderValue(value);
	updateInputSliderValue(value);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url, tabId) => {
    // if user opens popup on non argos domain
    if(!url.includes(".argos.co.uk/product/")){
    }

    getSavedDiscount('discountSavedInMemory', (savedDiscount) => {
      if (savedDiscount) {
        calculateNewPrice(savedDiscount, tabId);
        updateSliderValue(savedDiscount);
        updateInputSliderValue(savedDiscount);
      } else {
        updateSliderValue(10);
      }
    });

    const slider = document.getElementById('amount-slider'),
		increment = document.getElementById('increment'),
		decrement = document.getElementById('decrement'),
		argosLogo = document.getElementById('argos-logo');

    increment.addEventListener('click', () => {
      if (parseInt(slider.value) < 50 ) {
        const percentageOff = parseInt(slider.value) + 5;
        updateValues(percentageOff, tabId);
      }
    });

    decrement.addEventListener('click', () => {
      if (parseInt(slider.value) > 5 ) {
        const percentageOff = parseInt(slider.value) - 5;
        updateValues(percentageOff, tabId);
      }
    });

    slider.addEventListener('input', (e) => {
      calculateNewPrice(slider.value, tabId);
      saveDiscount(slider.value);
      updateSliderValue(slider.value);
    });

    argosLogo.addEventListener('click', () => {
    	chrome.tabs.create({url: 'https://www.argos.co.uk'})})
  });
});
