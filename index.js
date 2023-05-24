const itemList = document.getElementById("productList");
const buttons = document.querySelectorAll(".btnAdd");
const loader = document.querySelector(".loader-bg");
const cart = document.getElementById("cart");
const store = document.getElementById("store");
const tabs = document.getElementById("categoryTabs");

let productItems = [];
let cartItems = [];
let categories = [];

async function getCategories () {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    const data = await response.json();
    categories = data;

    tabs.innerHTML += `<button id="all" class="px-2 py-2 text-gray-800 shadow-lg uppercase"> All </button>`;
    categories.forEach((category) => {
      tabs.innerHTML += `<button  class="px-2 py-2 text-gray-800 shadow-lg uppercase" id="${category}"> ${category}</button>`
    })
  }catch (error) {
    console.log(error);
  }
}

async function fetchProducts() {
  try {

    getCategories();
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        loader.classList.add("active");
        productItems = data;
        productItems.forEach((item) => {
          let card = document.createElement("div");
          card.classList.add(
            "flex",
            "flex-col",
            "box",
            "relative",
            "transition",
            "ease-in-out",
            "delay-120",
            "shadow-lg",
          );
          card.innerHTML = `
              <img src="${item.image}" class='product-item h-full'>
              <h4 class='text-center text-md'> ${item.title.substring(0, 25) + "..."} </h4>
            `;
          const actionManager = document.createElement('div')
          actionManager.classList.add('grid-by-2');
          const viewBtn = document.createElement('button')
          viewBtn.classList.add('border-2', "border-gray-500","text-neutral-700", "w-full", "px-2", "py-2", 'font-bold')
          viewBtn.textContent = "View Product";
          const button = document.createElement("button");
          button.classList.add("bg-red-700", "text-white", "w-full", "px-2", "py-2", 'font-bold');
          button.textContent = `Add to Cart`;

          actionManager.appendChild(viewBtn)
          actionManager.appendChild(button)
          button.onclick = () => {
          
            cartItems.push(item); // The entire item object can be accessed here
            checkCart();
          };
          card.appendChild(actionManager);
          itemList.appendChild(card);
          
        });
    });
  }catch (error) {
    console.log(error);
  }
  loader.classList.remove('active')
}

function checkCart() {
  if (cartItems.length == 0) {
    const placeHoldText = document.createElement("div");
    placeHoldText.classList.add("text-center", "text-xl", "uppercase");
    placeHoldText.innerHTML = "No items in cart";
    cart.appendChild(placeHoldText);
  } else {
    let text = "";
    cartItems.forEach((item) => {
      text += `<div
      class=" p-1 grid grid-cols-3 justify-items-stretch border-2 "
      id=""
    >
      <div>${item.id}</div>
      <div>${item.title}</div>
      <div class="justify-self-end">$${item.price}</div>
    </div>`;
    });
    cart.innerHTML = text;
  }
}


window.onload = function() {
  if (store) {
    fetchProducts();
  }
};