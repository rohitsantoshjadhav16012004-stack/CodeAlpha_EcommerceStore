
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty 🛒</p>";

        cartTotal.textContent = "0";

        return;
    }

    cart.forEach((item, index) => {

        const div = document.createElement("div");

        div.innerHTML = `
            <p>
                ${item.name} - ₹${item.price}

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                ${item.quantity}

                <button onclick="increaseQuantity(${index})">
                    +
                </button>
            </p>
        `;

        cartItems.appendChild(div);

        total += item.price * item.quantity;

    });

    cartTotal.textContent = total;
}


function increaseQuantity(index) {

    cart[index].quantity++;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


function decreaseQuantity(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


// CLEAR CART

document
    .getElementById("clear-cart")
    .addEventListener("click", () => {

        cart = [];

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        displayCart();

    });


// CHECKOUT

document
    .getElementById("checkout")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;
        }

        window.location.href =
            "checkout.html";

    });


// DISPLAY CART

displayCart();