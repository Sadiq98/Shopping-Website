




function populateCard(cardElement, productData) {
    const titleElement = cardElement.querySelector('.card-title');
    const priceElement = cardElement.querySelector('.price');
    // const categryElement = cardElement.querySelector('.category');

    const imageElement = cardElement.querySelector('.card-img-top');

    titleElement.innerHTML = productData.title;
    priceElement.innerHTML = productData.price;
    // categryElement.innerHTML=productData.category;
    imageElement.src = productData.thumbnail;
}

function getProduct() {
    // Make API call
    // fetch('https://fakestoreapi.com/products')
        fetch('https://dummyjson.com/products')

        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Find all card elements
            const cardElements = document.querySelectorAll('.card');

            // Populate each card with data
            cardElements.forEach((cardElement, index) => {
                populateCard(cardElement, data.products[index]);
            });
        })
        .catch(error => {
            console.error('Error fetching products.', error);
        });
}

window.addEventListener('load', getProduct);


