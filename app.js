// Store all products globally
let allProducts = [];

// DOM Elements
const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const detailModal = document.getElementById('detailModal');
const closeBtn = document.getElementById('closeBtn');

// Event Listeners
searchInput.addEventListener('input', filterProducts);
closeBtn.addEventListener('click', closeModal);
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        closeModal();
    }
});

// Fetch and display products
async function loadProducts() {
    try {
        contentDiv.innerHTML = '<div class="loading">Loading products...</div>';
        
        // Fetch from db.json (works when served via GitHub Pages or local server)
        const response = await fetch('./db.json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if data has items property
        if (data.items && Array.isArray(data.items)) {
            allProducts = data.items;
        } else if (Array.isArray(data)) {
            allProducts = data;
        } else {
            throw new Error('Invalid data format');
        }
        
        if (allProducts.length === 0) {
            contentDiv.innerHTML = '<div class="empty-state">No products found</div>';
            return;
        }
        
        displayProducts(allProducts);
    } catch (error) {
        contentDiv.innerHTML = `
            <div class="error">
                <strong>Error loading products:</strong><br>
                ${error.message}<br>
                <small>Please ensure db.json is in the same directory as index.html</small>
            </div>
        `;
        console.error('Error:', error);
    }
}

// Display products in grid
function displayProducts(products) {
    if (products.length === 0) {
        contentDiv.innerHTML = '<div class="empty-state">No products match your search</div>';
        return;
    }

    const gridHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="view-details-btn" onclick="event.stopPropagation(); showProductDetail(${product.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    contentDiv.innerHTML = `<div class="products-grid">${gridHTML}</div>`;
}

// Filter products based on search input
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    displayProducts(filtered);
}

// Show product detail in modal
function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }

    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalPrice').textContent = product.price;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalId').textContent = `Product ID: #${product.id}`;

    detailModal.style.display = 'block';
}

// Close modal
function closeModal() {
    detailModal.style.display = 'none';
}

// Keyboard support - ESC to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);
