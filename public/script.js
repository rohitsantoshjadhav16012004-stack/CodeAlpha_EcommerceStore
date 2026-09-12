const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");


// ================================
// LOAD PRODUCTS FROM MONGODB
// ================================

async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        const products =
            await response.json();

        const productList =
            document.getElementById("product-list");

        productList.innerHTML = "";

        products.forEach((product) => {

            const div =
                document.createElement("div");

            div.className = "product";

            div.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ₹${product.price}
                </p>

                <button
                    onclick="viewProduct('${product._id}')"
                >
                    View Details
                </button>

                <button
                    onclick="addToCart('${product.name}', ${product.price})"
                >
                    Add to Cart
                </button>

            `;

            productList.appendChild(div);

        });

    } catch (error) {

        console.log(
            "Failed to load products:",
            error
        );

    }

}


// ================================
// ADD PRODUCT TO CART
// ================================

function addToCart(name, price) {

    const existingItem =
        cart.find(
            item => item.name === name
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();


    alert(
        `✅ ${name} added to cart!`
    );

}


// ================================
// DISPLAY CART
// ================================
function displayCart() {

    if (cartItems) {
        cartItems.innerHTML = "";
    }

    let total = 0;

    if (cartItems) {

        if (cart.length === 0) {

            cartItems.innerHTML =
                "<p>Your cart is empty 🛒</p>";

            cartTotal.textContent = "0";

        } else {

            cart.forEach((item, index) => {

                const div =
                    document.createElement("div");

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
    }


    // Update header cart count
    if (cartCount) {

        const count = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = count;
    }
}



// ================================
// INCREASE QUANTITY
// ================================

function increaseQuantity(index) {

    cart[index].quantity++;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}


// ================================
// DECREASE QUANTITY
// ================================

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


// ================================
// CLEAR CART
// ================================

const clearCartButton =
    document.getElementById("clear-cart");


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        () => {

            cart = [];


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            displayCart();

        }
    );

}


// ================================
// CHECKOUT
// ================================

const checkoutButton =
    document.getElementById("checkout");


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

                return;

            }


            window.location.href =
                "checkout.html";

        }
    );

}


// ================================
// LOAD PRODUCTS WHEN PAGE OPENS
// ================================

loadProducts();


// ================================
// DISPLAY CART WHEN CART PAGE OPENS
// ================================

if (cartItems) {

    displayCart();

}


// ================================
// VIEW PRODUCT DETAILS
// ================================

function viewProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;

}