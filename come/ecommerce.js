document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "UltraBook Pro",
            price: 1299.99,
            image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            category: "Laptops",
            rating: 4.8,
            description: "Thin and lightweight laptop with powerful performance"
        },
        {
            id: 2,
            name: "Galaxy Phone X",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            category: "Phones",
            rating: 4.6,
            description: "Flagship smartphone with amazing camera system"
        },
        {
            id: 3,
            name: "Quantum Headphones",
            price: 249.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            category: "Audio",
            rating: 4.9,
            description: "Noise-cancelling wireless headphones with premium sound"
        },
        {
            id: 4,
            name: "Pro Gaming Console",
            price: 499.99,
            image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            category: "Gaming",
            rating: 4.7,
            description: "Next-gen gaming console with 4K HDR support"
        }
    ];

    // Cart state
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const productsContainer = document.getElementById('products-container');

    // Initialize the page
    function init() {
        renderProducts();
        setupEventListeners();
        updateCartCount();
        startCountdown();
    }

    // Render products
    function renderProducts() {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-xl overflow-hidden shadow-md product-card transition duration-300';
            productCard.innerHTML = `
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        ${product.rating} <i class="fas fa-star ml-1 text-white"></i>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-1">${product.name}</h3>
                    <p class="text-gray-500 text-sm mb-2">${product.category}</p>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-lg">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition" data-id="${product.id}">
                            <i class="fas fa-cart-plus mr-1"></i> Add
                        </button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Cart toggle
        cartIcon.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);

        // Add to cart buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = parseInt(button.getAttribute('data-id'));
                addToCart(productId);
            }
        });

        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && !cartSidebar.classList.contains('translate-x-full')) {
                toggleCart();
            }
        });
    }

    // Toggle cart visibility
    function toggleCart() {
        cartSidebar.classList.toggle('translate-x-full');
        if (!cartSidebar.classList.contains('translate-x-full')) {
            renderCartItems();
        }
    }

    // Add product to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCartCount();
        animateCartIcon();
        renderCartItems();
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        document.getElementById('sidebar-cart-count').textContent = totalItems;
    }

    // Animate cart icon
    function animateCartIcon() {
        cartIcon.classList.add('cart-pulse');
        setTimeout(() => {
            cartIcon.classList.remove('cart-pulse');
        }, 1500);
    }

    // Render cart items
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
            cartSubtotal.textContent = '$0.00';
            cartTotal.textContent = '$0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-start border-b border-gray-200 pb-4';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                <div class="flex-1">
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-gray-500 text-sm">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <div class="flex justify-between items-center mt-1">
                        <span class="font-medium">$${itemTotal.toFixed(2)}</span>
                        <button class="remove-from-cart text-red-500 hover:text-red-700 text-sm" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        renderCartItems();
    }

    // Countdown timer for special offer
    function startCountdown() {
        // Set the date we're counting down to (3 days from now)
        const countDownDate = new Date();
        countDownDate.setDate(countDownDate.getDate() + 3);

        // Update the count down every 1 second
        const countdown = setInterval(function() {
            // Get today's date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            document.getElementById("countdown-days").textContent = days.toString().padStart(2, '0');
            document.getElementById("countdown-hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("countdown-minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("countdown-seconds").textContent = seconds.toString().padStart(2, '0');
            
            // If the count down is finished, clear interval
            if (distance < 0) {
                clearInterval(countdown);
                document.getElementById("countdown-days").textContent = "00";
                document.getElementById("countdown-hours").textContent = "00";
                document.getElementById("countdown-minutes").textContent = "00";
                document.getElementById("countdown-seconds").textContent = "00";
            }
        }, 1000);
    }

    // Initialize the app
    init();
});