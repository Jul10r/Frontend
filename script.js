const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 159000,
        category: "phone",
        image: "foto/iphone.jpg"
    },
    {
        id: 2,
        name: "Samsung S24 Ultra",
        price: 149000,
        category: "phone",
        image: "foto/samsung.jpg"
    },
    {
        id: 3,
        name: "MacBook Pro M3",
        price: 299000,
        category: "laptop",
        image: "foto/macbook.jpg"
    },
    {
        id: 4,
        name: "Dell XPS 15",
        price: 249000,
        category: "laptop",
        image: "foto/dell.jpg"
    },
    {
        id: 5,
        name: "iPad Pro",
        price: 129000,
        category: "tablet",
        image: "foto/ipad.jpg"
    },
    {
        id: 6,
        name: "AirPods Pro",
        price: 39000,
        category: "accessory",
        image: "foto/airpods.jpg"
    }
];

let cart = [];
let currentUser = null;

// Shto këtë objekt për përshkrimet e kategorive
const categoryDescriptions = {
    phone: "Smartphone",
    laptop: "Kompjuter portativ",
    tablet: "Tablet",
    accessory: "Aksesor"
};

// Shto këtë objekt për përshkrimet e produkteve
const productDescriptions = {
    1: "iPhone 15 Pro me procesor A17 Pro, kamera 48MP dhe ekran Super Retina XDR OLED 6.1-inch.",
    2: "Samsung S24 Ultra me S Pen, kamera 200MP dhe ekran Dynamic AMOLED 2X 6.8-inch.",
    3: "MacBook Pro M3 me chip Apple Silicon, ekran Liquid Retina XDR dhe deri në 22 orë jetëgjatësi baterie.",
    4: "Dell XPS 15 me procesor Intel i9, NVIDIA RTX dhe ekran 4K OLED touch 15.6-inch.",
    5: "iPad Pro me chip M2, ekran Liquid Retina XDR dhe mbështetje për Apple Pencil 2.",
    6: "AirPods Pro me anulim aktiv të zhurmës, audio hapësinor dhe rezistencë ndaj ujit IPX4."
};

// Shto variabël për të mbajtur kategorinë aktive
let activeCategory = 'all';

// Shfaq produktet
function displayProducts(category = 'all') {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>Nuk u gjetën produkte në këtë kategori</h3>
                <p>Ju lutemi provoni një kategori tjetër</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" 
                 loading="lazy" onload="handleImageLoad(this)">
            <span class="product-category">${categoryDescriptions[product.category]}</span>
            <h4>${product.name}</h4>
            <p class="product-description">${productDescriptions[product.id]}</p>
            <div class="product-details">
                <div class="price">${(product.price / 100).toFixed(2)} EUR</div>
                <span class="stock-status">Në Gjendje</span>
            </div>
            <button onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Shto në Shportë
            </button>
        `;
        container.appendChild(productElement);
    });

    // Përditëso breadcrumbs
    document.getElementById('current-category').textContent = 
        category === 'all' ? 'Të gjitha produktet' : categoryDescriptions[category];
}

// Filtro produktet sipas kategorisë
function filterByCategory(category) {
    // Filtro produktet
    displayProducts(category);
    
    // Scroll te seksioni i produkteve
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Përditëso klasën active në category cards
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.getAttribute('data-category') === category) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Shto në shportë
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
        updateCartCount();
    }
}

// Hiq nga shporta
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    updateCartCount();
}

// Përditëso shportën
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>${(item.price / 100).toFixed(2)} EUR</p>
            </div>
            <button onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });

    cartTotal.textContent = `${(total / 100).toFixed(2)} EUR`;
}

// Përditëso numrin e produkteve në shportë
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Shfaq/fsheh shportën
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Checkout
function checkout() {
    if (!currentUser) {
        alert('Ju lutem hyni në llogari për të bërë një porosi!');
        window.location.href = 'register.html';
        return;
    }

    if (cart.length === 0) {
        alert('Shporta juaj është bosh!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Porosia juaj u krye me sukses!\nTotali: ${(total / 100).toFixed(2)} EUR`);
    
    cart = [];
    updateCart();
    updateCartCount();
    toggleCart();
}

// Kontrollo përdoruesin kur ngarkohet faqja
window.onload = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    // Aktivizo kategorinë "Të Gjitha" fillimisht
    const allCategoryCard = document.querySelector('[data-category="all"]');
    if (allCategoryCard) {
        allCategoryCard.classList.add('active');
    }
    
    // Shfaq produktet në load
    displayProducts('all');
    updateCartCount();
    updateNavbar();
    
    // Shto event listeners për kategoritë
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.closest('.category-card').dataset.category;
            handleCategoryClick(category);
        });
    });
};

// Përditëso HTML-në e kategorive për të shtuar data-category
document.addEventListener('DOMContentLoaded', function() {
    const categoriesSection = document.querySelector('.categories-grid');
    if (categoriesSection) {
        const categoryCards = categoriesSection.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const categoryLink = card.querySelector('.category-link');
            const category = categoryLink.getAttribute('onclick').match(/'([^']+)'/)[1];
            card.setAttribute('data-category', category);
        });
    }
});

// Shto këtë funksion të ri
function handleCategoryClick(category) {
    // Parandalojmë sjelljen default të link-ut
    event.preventDefault();
    
    // Përditësojmë kategorinë aktive
    activeCategory = category;
    
    // Filtrojmë produktet
    displayProducts(category);
    
    // Përditësojmë klasën active në category cards
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.dataset.category === category) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // Scroll te produktet me animacion
    const productsSection = document.getElementById('products');
    const headerOffset = 100;
    const elementPosition = productsSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Përditëso funksionin searchProducts për të respektuar filtrin e kategorisë
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('products-container');
    
    let filteredProducts = products;
    
    // Apliko filtrin e kategorisë nëse nuk është 'all'
    if (activeCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
    }
    
    // Pastaj apliko filtrin e kërkimit
    if (searchTerm.trim()) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            productDescriptions[product.id].toLowerCase().includes(searchTerm)
        );
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>Nuk u gjetën produkte</h3>
                <p>Provoni të kërkoni me terma të tjerë ose ndryshoni kategorinë</p>
            </div>
        `;
    } else {
        container.innerHTML = '';
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <span class="product-category">${categoryDescriptions[product.category]}</span>
                <h4>${product.name}</h4>
                <p class="product-description">${productDescriptions[product.id]}</p>
                <div class="product-details">
                    <div class="price">${(product.price / 100).toFixed(2)} EUR</div>
                    <span class="stock-status">Në Gjendje</span>
                </div>
                <button onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Shto në Shportë
                </button>
            `;
            container.appendChild(productElement);
        });
    }
}

// Shto debouncing për kërkimin
let searchTimeout;
document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchProducts();
    }, 300);
});

// Implemento lazy loading për imazhet
function handleImageLoad(img) {
    img.classList.add('loaded');
}

// Implemento infinite scroll
let isLoading = false;
let currentPage = 1;
const productsPerPage = 8;

window.addEventListener('scroll', () => {
    if (isLoading) return;

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreProducts();
    }
});

function loadMoreProducts() {
    isLoading = true;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-more';
    loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <p>Duke ngarkuar më shumë produkte...</p>
    `;
    document.getElementById('products-container').appendChild(loadingIndicator);

    // Simulojmë ngarkimin e produkteve të reja
    setTimeout(() => {
        loadingIndicator.remove();
        currentPage++;
        isLoading = false;
    }, 1000);
}

// Në fund të script.js, shto këtë funksion për të përditësuar navbar-in
function updateNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navMenu = document.querySelector('.nav-menu');
    
    if (currentUser) {
        navMenu.innerHTML = `
            <a href="index.html" class="active">Dyqani</a>
            <a href="#" id="logout-btn">Dil</a>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'register.html';
        });
    } else {
        navMenu.innerHTML = `
            <a href="index.html" class="active">Dyqani</a>
            <a href="register.html">Hyr/Regjistrohu</a>
        `;
    }
}