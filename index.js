const itemList = document.getElementById("productList");
const buttons = document.querySelectorAll(".btnAdd");
const loader = document.querySelector(".loader-bg");
const cart = document.getElementById("cart");
const store = document.getElementById("store");
const tabs = document.getElementById("category-filter");

let productItems = [];
let cartItems = [];
let categories = [];

async function getCategories () {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    const data = await response.json();
    categories = data;

    tabs.innerHTML += `<input type="radio" name="categories" id="all" class="px-2 py-2 text-gray-800 shadow-lg uppercase categoryBtn" checked>
    <label for="all"> All</label><br>`;
    categories.forEach((category) => {
    tabs.innerHTML += `<input type="radio" name="categories"  class="px-2 py-2 text-gray-800 shadow-lg uppercase categoryBtn" id="${category}"> <label for="${category}"> ${category}</label><br>`
    
    })
    
    const categoryBtns = document.querySelectorAll('.categoryBtn');

    categoryBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const categoryId = button.id;
        const newItems = filterByCategory(categoryId);
        showProducts(newItems); 
      });
    });
  }catch (error) {
    console.log(error);
  }
}

const filterByCategory = (category) => {
  let filteredItems = productItems.filter((item) => item.category == category);
  let newItems = category == 'all' ? productItems : filteredItems;
  return newItems;
}

const showProducts = (products) => {
  itemList.innerHTML = '';
  products.forEach((item) => {
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
      <img src="${item.image}" class='product-item h-full my-4'>
      <hr>
      <div class="mx-4 my-4">
        <div>
          <h6 class="text-gray-400">Product Name:</h6>
          <h4 class='text-md text-gray-700'> ${item.title.substring(0, 25) + "..."} </h4>
        </div>
        <div> 
          <h6 class="text-gray-400">Price:</h6>
          <h3 class="font-bold text-gray-700 text-xl" > $${item.price}</h3>
        </div>
      </div>
      <hr>
    `;
    const actionManager = document.createElement('div')
    // actionManager.classList.add('grid-by-2');
    const viewBtn = document.createElement('button')
    viewBtn.classList.add("text-neutral-700", "w-full", "px-2", "py-2", 'font-bold', 'bg-gray-50')
    viewBtn.textContent = "View Product";

    const button = document.createElement("button");

    button.classList.add("bg-gray-50", "text-red-700", "w-full", "px-2", "py-2", 'font-bold');
    button.textContent = `Add to Cart`;

    actionManager.appendChild(viewBtn)
    actionManager.appendChild(button)
    button.onclick = () => {
      console.log("test")
      cartItems.push(item); // The entire item object can be accessed here
      console.log(cartItems);
      checkCart();
    };
    card.appendChild(actionManager);
    itemList.appendChild(card);
  });
}


async function fetchProducts() {
  try {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        loader.classList.add("active");
        productItems = data;
        showProducts(productItems)
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
    // cart.appendChild(placeHoldText);
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
    // cart.innerHTML = text;
  }
}


window.onload = function() {
  if (store) {
    fetchProducts();
    getCategories();
  }
};