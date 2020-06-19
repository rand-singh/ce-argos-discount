/**
 * Get all the tabs that have 
 * the specified properties
 * 
 * @param {*} callback 
 */
function getCurrentTabUrl(callback) {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

/**
 * Calculate the amount to take 
 * away from full price
 * 
 * @param {*} percentageOff 
 * @param {*} currentPrice 
 */
function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

/**
 * Calculates the new price 
 * 
 * @param {*} discount 
 */
function calculateNewPrice(discount){
  chrome.tabs.executeScript({
    code: "var selected_discount =" + discount + " ;"
  }, function(){
    chrome.tabs.executeScript({
      file: "js/calculate.js"
    })
  });
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

/**
 * Update the slider input 
 * value in the popup
 * 
 * @param {*} value 
 */
function updateInputSliderValue(value){
    document.getElementById('amount-slider').value = value;
}

/**
 * Update the text displayed
 * value in the popup
 * 
 * @param {*} sliderValue 
 */
function updateSliderValue(sliderValue){
    document.getElementById('range-value').innerHTML = sliderValue;
}

/**
 * Updates all values when the 
 * increment or decrement 
 * button is clicked 
 * 
 * @param {*} value 
 */
function updateValues(value) {
	calculateNewPrice(value);
	saveDiscount(value);
	updateSliderValue(value);
	updateInputSliderValue(value);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {

    // if user opens popup on non argos domain
    if(!url.includes(".argos.co.uk/product/")){
    }

    getSavedDiscount('discountSavedInMemory', (savedDiscount) => {
      if (savedDiscount) {
        calculateNewPrice(savedDiscount);

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
		if(parseInt(slider.value) < 50 ) {
			const percentageOff = parseInt(slider.value) + 5;
			updateValues(percentageOff);
		}
	});

	decrement.addEventListener('click', () => {
		if(parseInt(slider.value) > 5 ) {
			const percentageOff = parseInt(slider.value) - 5;
			updateValues(percentageOff);
		}
	});

    slider.addEventListener('input', () => {
      calculateNewPrice(slider.value);
      saveDiscount(slider.value);
      updateSliderValue(slider.value);
    });

    argosLogo.addEventListener('click', () => chrome.tabs.create({url: 'https://www.argos.co.uk'}))
  });
});
