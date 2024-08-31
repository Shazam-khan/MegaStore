fetch('./api/products.json')
  .then(response => response.json())
  .then(products => {
    console.log(products);
    import('./homeProductCards.js').then(module => {
      module.showProductContainer(products);
    });
  })
  .catch(error => console.error('Error loading JSON:', error));


