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
  // var discount_amount = discount;

  // var script = "console.log('Discount amount is " + discount + "');";

  chrome.tabs.executeScript({
    code: "var selected_discount =" + discount + " ;"    
  }, function(){
    chrome.tabs.executeScript({
      file: "calculate.js"
    })
  });
}




document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {

    var dropdown = document.getElementById('dropdown');

    // Load the saved background color for this page and modify the dropdown
    // value, if needed.
    // getSavedBackgroundColor(url, (savedColor) => {
    //   if (savedColor) {
    //     changeBackgroundColor(savedColor);
    //     dropdown.value = savedColor;
    //   }
    // });

    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
    	calculateNewPrice(dropdown.value);

      // changeBackgroundColor(dropdown.value);
      // saveBackgroundColor(url, dropdown.value);
    });


  });
});