const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load products from MongoDB
async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        const productList = document.getElementById("product-list");

        productList.innerHTML = "";

        products.forEach((product) => {
            const div = document.createElement("div");

            div.className = "product";
div.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>

    <button onclick="viewProduct('${product._id}')">
        View Details
    </button>

    <button onclick="addToCart('${product.name}', ${product.price})">
        Add to Cart
    </button>
`;
          

            productList.appendChild(div);
        });

    } catch (error) {
        console.log("Failed to load products:", error);
    }
}

// Add product to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

// Display cart
function displayCart() {
     if (!cartItems) return;
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p>
                ${item.name} - ₹${item.price}
                <button onclick="decreaseQuantity(${index})">−</button>
                ${item.quantity}
                <button onclick="increaseQuantity(${index})">+</button>
            </p>
        `;

        cartItems.appendChild(div);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = total;
}

// Increase quantity
function increaseQuantity(index) {
    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

// Decrease quantity
function decreaseQuantity(index) {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

// Clear cart
const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    cart = [];

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
});
}

// Checkout
const checkoutButton = document.getElementById("checkout");

if (checkoutButton) {
    checkoutButton.addEventListener("click", async () => {

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const customerName = prompt("Enter your name:");
        const customerEmail = prompt("Enter your email:");

        if (!customerName || !customerEmail) {
            alert("Please enter your name and email.");
            return;
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    items: cart,
                    total
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert("Order failed!");
                return;
            }

            alert(data.message);

            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();

        } catch (error) {
            alert("Server error. Please try again.");
            console.log(error);
        }
    });
}

// Load products when page opens
loadProducts();

if (cartItems) {
    displayCart();
}

function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}