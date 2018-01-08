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

function calculateAmountDeducted(percentageOff, currentPrice){
  return (percentageOff/100) * currentPrice;
}

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

function updateInputSliderValue(value){
    document.getElementById('amount-slider').value = value;    
}

function updateSliderValue(sliderValue){
    document.getElementById('range-value').innerHTML = sliderValue;
}


document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {

    // if user opens popup on non argos domain
    if(!url.includes(".argos.co.uk/product/")){
    }

    getSavedDiscount('discountSavedInMemory', (savedDiscount) => {
      if (savedDiscount) {
        calculateNewPrice(savedDiscount);

        console.log("update slider value to: " + savedDiscount);
        updateSliderValue(savedDiscount);
        updateInputSliderValue(savedDiscount);
      } else {
        updateSliderValue(10);
      }
    });

    var slider = document.getElementById('amount-slider');

    slider.addEventListener('input', () => {
      calculateNewPrice(slider.value);
      saveDiscount(slider.value);
      updateSliderValue(slider.value);
    });


  });
});


