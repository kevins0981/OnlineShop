const addToCartElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelectorAll(".nav-items .badge");

async function addToCart() {
    const productId = addToCartElement.dataset.productid;
    const csrfToken = addToCartElement.dataset.csrf;
    let response;
    try{
    response = await fetch('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
            productId: productId,
            _csrf: csrfToken
        }),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    }catch(err){
        alert('Something went wrong!');
        return;
    }

    if(!response.ok){
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();


    const newTotalQuantity = responseData.newTotalItems;
    for(const cartBadge of cartBadgeElement)
    {
        cartBadge.textContent = newTotalQuantity;
    }
    
}

addToCartElement.addEventListener('click', addToCart);