import { getCartProductFromLS, updateCartValue } from './homeProductCards.js';


fetch('./api/products.json')
    .then(response => response.json())
    .then(products => {
        let cartProducts = getCartProductFromLS();
        let filterProducts = products.filter((curProd) => {
            return cartProducts.some((curElem) => curElem.id === curProd.id);
        });

        console.log(filterProducts);
        
        const cartElement = document.querySelector("#productCartContainer");
        const templateContainer = document.querySelector("#productCartTemplate");

        const showCartProduct = () => {
            filterProducts.forEach((curProd) => {
                const { category, id, image, name, price, stock } = curProd;
    
                let productClone = document.importNode(templateContainer.content, true);
                const lSActualData = fetchQuantityFromCartLS(id, price);

                productClone.querySelector("#cardValue").setAttribute("id", `card${id}`);
                productClone.querySelector(".category").textContent = category;
                productClone.querySelector(".productName").textContent = name;
                productClone.querySelector(".productImage").src = image;

                productClone.querySelector(".productQuantity").textContent = lSActualData.quantity;
                productClone.querySelector(".productPrice").textContent = lSActualData.price;

                productClone.querySelector(".stockElement").addEventListener("click", (event) => {
                    incrementDecrement(event, id, stock, price);
                });

                productClone.querySelector(".remove-to-cart-button").addEventListener("click", () => removeProdFromCart(id));

                cartElement.appendChild(productClone);
            });
        };
        
        showCartProduct();
        updateCartProductTotal();
    })
    .catch(error => console.error('Error loading JSON:', error));

    
    const fetchQuantityFromCartLS = (id, price) => {
        let cartProducts = getCartProductFromLS();
      
        let existingProduct = cartProducts.find((curProd) => curProd.id === id);
        let quantity = 1;
      
        if (existingProduct) {
          quantity = existingProduct.quantity;
          price = existingProduct.price;
        }
      
        return { quantity, price };
    };

    const removeProdFromCart = (id) => {
        let cartProducts = getCartProductFromLS();
        cartProducts = cartProducts.filter((curProd) => curProd.id !== id);

        //update the cart button value
        localStorage.setItem("cartProductLS", JSON.stringify(cartProducts));

        //   to remove the div onclick
        let removeDiv = document.getElementById(`card${id}`);
        if (removeDiv) {
            removeDiv.remove();

            showToast("delete", id);
        }

        updateCartValue(cartProducts);
        updateCartProductTotal();
    };

    
    const incrementDecrement = (event, id, stock, price) => {
        const currentCardElement = document.querySelector(`#card${id}`);
        const productQuantity = currentCardElement.querySelector(".productQuantity");
        const productPrice = currentCardElement.querySelector(".productPrice");
    
        let quantity = 1;
        let localStoragePrice = 0;
    
        let LocalCartProduct = getCartProductFromLS();
        let existingProd = LocalCartProduct.find((curProd) => curProd.id === id);
    
        if(existingProd){
            quantity = existingProd.quantity;
            localStoragePrice = existingProd.price;
        } else {
            localStoragePrice = price;
            price = price;
        }
    
        if (event.target.className === "cartIncrement") {
            if (quantity < stock) {
              quantity += 1;
            } else if (quantity === stock) {
              quantity = stock;
              localStoragePrice = price * stock;
            }
          }
        
          if (event.target.className === "cartDecrement") {
            if (quantity > 1) {
              quantity -= 1;
            }
          }
    
          localStoragePrice = price * quantity;
          localStoragePrice = Number(localStoragePrice.toFixed(2));
    
          let updatedCart = { id, quantity, price:localStoragePrice };
      
          updatedCart = LocalCartProduct.map((curProd) => {
            return curProd.id === id ? updatedCart : curProd;
          });
      
          localStorage.setItem("cartProductLS", JSON.stringify(updatedCart));
    
          productQuantity.innerText = quantity;
          productPrice.innerText = localStoragePrice;
          
          updateCartProductTotal();
    };


    const updateCartProductTotal = () => {
        let productSubTotal = document.querySelector(".productSubTotal");
        let productFinalTotal = document.querySelector(".productFinalTotal");
      
        let localCartProducts = getCartProductFromLS();
        let initialValue = 0;
        let totalProductPrice = localCartProducts.reduce((accum, curElem) => {
        
            let productPrice = parseInt(curElem.price) || 0;
          return accum + productPrice;
        }, initialValue);
      
        productSubTotal.textContent = `PKR ${totalProductPrice}`;
        productFinalTotal.textContent = `PKR ${totalProductPrice + 300}`;
    };


    export function showToast(operation, id) {
        const toast = document.createElement("div");
        toast.classList.add("toast");
      
        // Set the text content of the toast based on the operation
        if (operation === "add") {
          toast.textContent = `Product with ID ${id} has been added to Cart.`;
        } else {
          toast.textContent = `Product with ID ${id} has been deleted from Cart.`;
        }
      
        document.body.appendChild(toast);
      
        // Automatically remove the toast after a few seconds
        setTimeout(() => {
          toast.remove();
        }, 3000);
    };