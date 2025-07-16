function getSavedDiscount(savedDiscount, callback) {
	chrome.storage.sync.get(savedDiscount, (items) => {		
		callback(chrome.runtime.lastError ? null : items[savedDiscount])
	})
}

function calculateAmountDeducted(percentageOff, currentPrice) {
	return (percentageOff / 100) * currentPrice
}

function calculateNewPrice(savedDiscount) {
	const discount_amount = savedDiscount
	const product_price_container = document.querySelector('section.pdp-pricing-module ul')
	const current_price = document.querySelector('section.pdp-pricing-module ul li').getAttribute('content')

	if (current_price) {
		const amount_deducted = calculateAmountDeducted(discount_amount, current_price)
		const discount_price = current_price - amount_deducted

		if (!product_price_container.parentElement.querySelector('ul.product-price-discounted')) {
			product_price_container.insertAdjacentHTML(
				'afterend',
				`
					<ul class='product-price-discounted'>
						<li>
							<h2>${discount_amount}% off &pound;${discount_price.toFixed(2)}</h2>
						</li>
						<li>
							<span>saving &pound;${amount_deducted.toFixed(2)}</span>
						</li>
					</ul>
				`
			)
		}
	} else {
		console.error('Original Price Not Found')
	}
}

function init() {
	const targetNode = document.getElementById('app')
    const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    }

    const callback = mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
				const addedNodes = mutation.addedNodes
				
				if (addedNodes.length) {
					Array.from(addedNodes).forEach(function(ele) {
						ele.classList?.contains('pdp-right') &&
						getSavedDiscount('discountSavedInMemory', (savedDiscount) => savedDiscount ? calculateNewPrice(savedDiscount) : calculateNewPrice(10))
					});
				}

                if (mutation.target.classList?.contains('pdp-pricing-module') || mutation.target.classList.contains('xs-block')) {
					getSavedDiscount('discountSavedInMemory', (savedDiscount) => savedDiscount ? calculateNewPrice(savedDiscount) : calculateNewPrice(10))
                }
            }
        })
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
}

document.addEventListener('DOMContentLoaded', init())
