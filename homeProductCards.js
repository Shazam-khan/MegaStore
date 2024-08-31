import { showToast } from "./showAddToCartCards.js";

const productContainer = document.querySelector("#productContainer");
const productTemplate = document.querySelector("#productTemplate");

export const showProductContainer = (products) =>{
    if(!products){
        return false;
    }

    products.forEach((curProd) =>{
        const { brand, category, description, id, image, name, price, stock } = curProd;
    
        const productClone = document.importNode(productTemplate.content, true);
        
        productClone.querySelector('#cardValue').setAttribute('id', `card${id}`);
        productClone.querySelector('.category').textContent = category;
        productClone.querySelector('.productName').textContent = name;
        productClone.querySelector('.productImage').src = image;
        productClone.querySelector('.productImage').alt = name;
        productClone.querySelector('.productDescription').textContent = description;
        productClone.querySelector('.productStock').textContent = stock;  
        productClone.querySelector('.productPrice').textContent = `PKR ${price}`;
        productClone.querySelector('.productActualPrice').textContent = `${price * 2}`;

        productClone.querySelector(".stockElement").addEventListener('click', (event)=>{
            homeQuantityToggle(event, id, stock);
        });

        productClone.querySelector(".add-to-cart-button").addEventListener("click", (event) => {
            addToCart(event, id, stock);
      });

        productContainer.append(productClone);
    });  
}; 


const homeQuantityToggle = (event, id, stock) => {
    const currentCardElement = document.querySelector(`#card${id}`);
  
    const productQuantity = currentCardElement.querySelector(".productQuantity");
  
    let quantity = parseInt(productQuantity.getAttribute("data-quantity")) || 1;
  
    if (event.target.className === "cartIncrement") {
      if (quantity < stock) {
        quantity += 1;
      } else if (quantity === stock) {
        quantity = stock;
      } 
    }
  
    if (event.target.className === "cartDecrement") {
      if (quantity > 1) {
        quantity -= 1;
      }
    }
    
    productQuantity.innerText = quantity;
    console.log(quantity);
    productQuantity.setAttribute("data-quantity", quantity.toString());
    return quantity;
};

const addToCart = (event, id, stock) => {
    let arrLocalStorageProduct = getCartProductFromLS();
  
    const currentProdElem = document.querySelector(`#card${id}`);
    let quantity = currentProdElem.querySelector(".productQuantity").innerText;
    let price = currentProdElem.querySelector(".productPrice").innerText;
    //   console.log(quantity, price);
    price = price.replace("PKR ", "");
  
    let existingProd = arrLocalStorageProduct.find(
      (curProd) => curProd.id === id
    );
  
    console.log(existingProd);
  
    if (existingProd && quantity >= 1) {
      quantity = Number(existingProd.quantity) + Number(quantity);
      price = Number(price * quantity);
      let updatedCart = { id, quantity, price };
  
      updatedCart = arrLocalStorageProduct.map((curProd) => {
        return curProd.id === id ? updatedCart : curProd;
      });
      console.log(updatedCart);
  
      localStorage.setItem("cartProductLS", JSON.stringify(updatedCart));
      //show toast when product added to the cart
      showToast("add", id);
    }
  
    if (existingProd) {
      return false;
    }
  
    price = Number(price * quantity);
    quantity = Number(quantity);
  
    arrLocalStorageProduct.push({ id, quantity, price });
    localStorage.setItem("cartProductLS", JSON.stringify(arrLocalStorageProduct));
  
    //update the cart button value
    updateCartValue(arrLocalStorageProduct);
  
    //show toast when product added to the cart
    showToast("add", id);
};

export const getCartProductFromLS = () => {
    let cartProducts = localStorage.getItem("cartProductLS");
    if (!cartProducts) {
      return [];
    }
    cartProducts = JSON.parse(cartProducts);
  
    //update the cart button value
    updateCartValue(cartProducts);
  
    return cartProducts;
};

const cartValue = document.querySelector("#cartValue");

export const updateCartValue = (cartProducts) => {
  return (cartValue.innerHTML = ` <i class="fa-solid fa-cart-shopping"> ${cartProducts.length} </i>`);
};