const itemList = document.getElementById("productList");
const buttons = document.querySelectorAll(".btnAdd");
const loader = document.querySelector(".loader-bg");
const cart = document.getElementById("cart");
const store = document.getElementById("store");
const tabs = document.getElementById("category-filter");
const maxPrice = document.getElementById("price-max");
const minPrice = document.getElementById("price-min");
const priceSetter = document.getElementById("price-setter");
const sortBySelect = document.getElementById("sort-by");
const closeModalBtn = document.getElementById("closeModal");
const modalContainer = document.getElementById("modalContainer");
const cartContent = document.getElementById("modalContent");
const addedToCart = document.getElementById("addedToCart");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const deleteBtn = document.getElementById("deleteBtn");


let productItems = [];
let cartItems = [];
let categories = [];
let featuredItems = [];



cart.addEventListener("click", () => {
  modalContainer.classList.add("open");
  checkCart();
});

modalContainer.addEventListener("click", (event) => {
  if (event.target === modalContainer) {
    modalContainer.classList.remove("open");
  }
});

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



if(sortBySelect) {
  sortBySelect.addEventListener("change", () => {
    const selectedValue = sortBySelect.value;
      sortProduct(productItems, selectedValue)
    });
}


const filterByCategory = (category) => {
  let filteredItems = productItems.filter((item) => item.category == category);
  let newItems = category == 'all' ? productItems : filteredItems;
  return newItems;
}

const showProducts = (products) => {
  itemList.innerHTML = '';
  if(products.length == 0) {
    const noValueDiv = document.createElement('div');
    noValueDiv.innerHTML = `<div class="relative top-0 right-9text-2xl text-center text-gray-700 mx-4 my-5 w-full">Oh noo.. There are no products.. </div>`;
    itemList.appendChild(noValueDiv);
  }
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
          <h3 class="font-bold text-gray-700 text-xl" >
            $${item.price} 
            <span class="text-gray-400 font-light text-base"> <del> $${(item.price * 1.30).toFixed(2)} </del> </span>
          </h3>
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
      let itemExist;

      cartItems.forEach((cartItem) => {
        if(cartItem.id == item.id) {
          itemExist = true;
          cartItem.quantity += 1;
        }
      })
      // const index = 
      if(!itemExist) {
        cartItems.push({...item, quantity: 1});
      }

      addedToCart.classList.add("show");
      setTimeout(() => {
        addedToCart.classList.remove("show");
      }, 2000);

      checkCart();
    };
    card.appendChild(actionManager);
    itemList.appendChild(card);
  });
}

const sortProduct = (products, sortBy) => {
  let items;
  switch(sortBy){
    case 'desc':
      items = products.sort((a, b) => b.price - a.price);
      break;
    case 'asc': 
      items = products.sort((a, b) => a.price - b.price);
      break;
  }
  showProducts(items);
}




async function fetchProducts() {
  if(loader) {
  try {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        getCategories();
        loader.classList.add("active");

        productItems = data;

        let featured = productItems.filter((item) => item.rating.rate > 4.5);
        featuredItems = featured;

        console.log(featuredItems);

        showProducts(productItems)
        const highestPrice = productItems.reduce((maxPrice, product) => {
          return (product.price > maxPrice) ? product.price : maxPrice;
        }, 0);
        maxPrice.innerHTML = `$ ${highestPrice}`;
        minPrice.textContent = "$ 0";
        priceSetter.innerHTML = `<div>
          <label for="price-range"></label>
          <input type="range" class="w-full" id="price-range" name="price-range" min="0" max="${highestPrice}" oninput="num.value = this.value" step="1" value="0"> </div>
        <div class="flex justify-between items-center bg-gray-50">
          <div> 
            <span> Current Filter: $</span> 
            <output id="num">0</output>
          </div>
          <div> 
            <button type="button" id="filterByPrice" class="px-2 py-2 bg-red-700 text-white font-medium rounded-sm">Filter</button> 
          </div>
        </div>     
        `
        const priceFilterer = document.getElementById("filterByPrice");
        
        priceFilterer.addEventListener('click', () => {
          const actualPrice = parseInt(document.getElementById("price-range").value, 10);
          let filteredByPrice = productItems.filter((item) => item.price <= actualPrice);
          showProducts(filteredByPrice);
        })

    });
  }catch (error) {
    console.log(error);
  }
  loader.classList.remove('active')
}
}


const hasItem = () => {
  let count = cartItems.length > 0 ? cartItems.length: '';
  cartCount.textContent = count;
}


if (cartItems.length == 0) {
  const placeHoldText = document.createElement("div");
  placeHoldText.classList.add("text-center", "text-xl", "uppercase");
  placeHoldText.innerHTML = "No items in cart";
  cartContent.appendChild(placeHoldText);
}

function checkCart() {
  // if (cartItems.length == 0) {
  //   const placeHoldText = document.createElement("div");
  //   placeHoldText.classList.add("text-center", "text-xl", "uppercase");
  //   placeHoldText.innerHTML = "No items in cart";
  //   cartContent.appendChild(placeHoldText);
  // } else {
    hasItem();
    let text = "";
    let total = 0;
    cartItems.forEach((item) => {
      text += `
      <div class="cart-items mb-2 ">
        <div class="mr-2"> <img src="${item.image}" class="small-img"> </div>
        <div class="text-xs" >${item.title.substring(0, 25) + "..."}</div>
        <div class="">$${item.price}</div>
        <div class="ml-auto quantity-control grid-by-3">
          <button class="quantity-btn px-2 bg-gray-100" onclick="decrementQuantity(${item.id})">-</button>
          <span class="quantity" id="actual-quantity">${item.quantity}</span>
          <button class="quantity-btn px-2 bg-gray-100" onclick="incrementQuantity(${item.id})">+</button>
        </div>
        <div class="delete-item ml-sm" id="deleteBtn" onclick="deleteItem(${item.id})">
          <button class="delete-btn flex items-center">
            <span class="material-icons" style="display: inline-block;">delete</span>
          </button>
        </div>
      </div>`;
      total += (item.price) * item.quantity; 
    });
    cartContent.classList.add('overflow-scroll')
    cartContent.innerHTML = text;
    cartTotal.textContent = total.toFixed(2);
  // }
}

const decrementQuantity = (itemId) => {
  cartItems.forEach((item) => {
    if(item.id == itemId) {
      if(item.quantity > 1 ) {
        item.quantity--;
        const itemQuantity = document.getElementById("actual-quantity");
        itemQuantity.textContent = item.quantity;
      }
    }
    checkCart();
  })
}

const incrementQuantity = (itemId) => {
  cartItems.forEach((item) => {
    if(item.id == itemId) {
        item.quantity++;
        const itemQuantity = document.getElementById("actual-quantity");
        itemQuantity.textContent = item.quantity;
    }
  })
  checkCart();
}

const deleteItem = (itemId) => {
  cartItems = cartItems.filter((item) => item.id !== itemId);
  checkCart();
}


window.onload = function() {
  if (store) {
    fetchProducts();
  }
};