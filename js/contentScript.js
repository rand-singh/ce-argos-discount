(() => {
    /**
     *
     * @param {*} percentageOff
     * @param {*} currentPrice
     */
    function calculateAmountDeducted(percentageOff, currentPrice) {
        return (percentageOff / 100) * currentPrice;
    }

    const priceElement = document.querySelector("li[data-test='product-price-primary']")
    const cureentPrice = priceElement.getAttribute('content')
    console.log(cureentPrice)

    const amountDeducted = calculateAmountDeducted(15, cureentPrice)
    console.log(amountDeducted.toFixed(2))

    const newPrice = cureentPrice - amountDeducted
    console.log(newPrice.toFixed(2))
    
    const discountContainer = document.createElement('div')
    discountContainer.classList.add('discount-container')

    // const textNode = document.createTextNode(`discount price is`)
    // node.appendChild(textNode)

    discountContainer.innerHTML = `
        <p>At 10% you pay £${newPrice.toFixed(2)} saving £${amountDeducted.toFixed(2)}</p>
    `

    document.getElementById("app").after(discountContainer)

// Mutation observer
    const targetNode = document.getElementById("app")

    const config = {
        attributes: true, 
        childList: true, 
        characterData: true,
        subtree: true 
    };
    
    const callback = mutations => {  
        mutations.forEach(mutation => {

            if (mutation.type === 'childList') {
                if (mutation.target.classList?.contains('pdp-pricing-module')) {
                    console.log(mutation)
                    mutation.target.querySelector('h2').style.color = 'red'
                    mutation.target.querySelector('ul li').insertAdjacentHTML(
                        "beforeend",
                        "<h2 class='product-price-discounted'>£" + newPrice.toFixed(2) + " </h2>"
                    );
                }
            }

            // if (mutation.type === 'childList') {
            //   const listValues = Array.from(targetNode.children)
            //       .map(node => node.innerHTML)
            //       .filter(html => html !== '<br>');
            //   console.log(listValues);
            // }
        });
    }

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
})();

// At 10% you pay £XX.XX saving £XX.XX
// At 15% you pay £XX.XX saving £XX.XX