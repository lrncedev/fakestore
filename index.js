const itemList = document.getElementById("productList");
const buttons = document.querySelectorAll(".btnAdd");
const cart = document.getElementById("cart");

let productItems = [];
let cartItems = [];

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((data) => {
    productItems = data;
    console.log("product items", productItems);
    // checkCart();
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
        "shadow-lg"
      );
      // <div class='flex box flex-col relative box transition ease-in-out delay-120 shadow-lg'></div>
      card.innerHTML = `
          <img src="${item.image}" class='w-full h-full'>
          <h4 class='text-center text-md'> ${item.title} </h4>
        `;
      const button = document.createElement("button");
      button.classList.add("bg-red-700", "text-white");
      button.textContent = `Add to Cart`;
      button.onclick = () => {
        // console.log(item); // The entire item object can be accessed here
        cartItems.push(item); // The entire item object can be accessed here
        console.log(item);
        // shareViaEmail();
        checkCart();
      };
      card.appendChild(button);
      itemList.appendChild(card);
    });
  });


// console.log(cartItems.length)

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
