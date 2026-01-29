// Store all products globally
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = null;
let editingProductId = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const tableContainer = document.getElementById('tableContainer');
const detailModal = document.getElementById('detailModal');
const backdrop = document.getElementById('backdrop');
const closeBtn = document.getElementById('closeBtn');
const editModal = document.getElementById('editModal');
const editBackdrop = document.getElementById('editBackdrop');

// Event Listeners
searchInput.addEventListener('input', onSearchChanged);
itemsPerPageSelect.addEventListener('change', onItemsPerPageChanged);
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
editBackdrop.addEventListener('click', closeEditModal);

// Fetch and load products
async function loadProducts() {
    try {
        tableContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
        
        const response = await fetch('./db.json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && Array.isArray(data.items)) {
            allProducts = data.items;
        } else if (Array.isArray(data)) {
            allProducts = data;
        } else {
            throw new Error('Invalid data format');
        }
        
        if (allProducts.length === 0) {
            tableContainer.innerHTML = '<div class="empty-state">No products found</div>';
            return;
        }
        
        filteredProducts = [...allProducts];
        displayTable();
    } catch (error) {
        tableContainer.innerHTML = `
            <div class="error">
                <strong>Error loading products:</strong><br>
                ${error.message}<br>
                <small>Please ensure db.json is in the same directory as index.html</small>
            </div>
        `;
    }
}

// Search functionality - triggered by onchange
function onSearchChanged(e) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayTable();
}

// Items per page change handler
function onItemsPerPageChanged() {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1;
    displayTable();
}

// Sorting function
function sortBy(sortType) {
    currentSort = sortType;
    let sorted = [...filteredProducts];
    
    switch(sortType) {
        case 'nameAsc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'priceAsc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'priceDesc':
            sorted.sort((a, b) => b.price - a.price);
            break;
    }
    
    filteredProducts = sorted;
    currentPage = 1;
    displayTable();
}

// Reset sorting
function resetSort() {
    currentSort = null;
    filteredProducts = [...allProducts];
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm !== '') {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayTable();
}

// Display table with pagination
function displayTable() {
    if (filteredProducts.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state">No products match your search</div>';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Generate table HTML
    const tableHTML = `
        <div class="table-container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th style="width: 8%;">ID</th>
                        <th style="width: 8%;">Image</th>
                        <th style="width: 22%;">Product Name</th>
                        <th style="width: 35%;">Description</th>
                        <th style="width: 12%;">Price</th>
                        <th style="width: 15%;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedProducts.map(product => `
                        <tr>
                            <td>
                                <strong>#${product.id}</strong>
                            </td>
                            <td>
                                <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                            </td>
                            <td>
                                <span class="product-name">${product.name}</span>
                            </td>
                            <td>
                                <small class="text-muted">${product.description.substring(0, 50)}...</small>
                            </td>
                            <td>
                                <span class="product-price">${product.price}</span>
                            </td>
                            <td>
                                <button class="action-btn" onclick="showProductDetail(${product.id})">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="action-btn" onclick="openEditModal(${product.id})" style="background: #4CAF50;">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="pagination-info">
            <div>
                <strong>Total: ${filteredProducts.length} products</strong> | 
                Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong>
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" onclick="previousPage()" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span style="padding: 0 10px; font-weight: 600;">Page ${currentPage}/${totalPages}</span>
                <button class="pagination-btn" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
                <div class="items-per-page">
                    <label for="itemsPerPage" style="margin: 0;">Items:</label>
                    <select id="itemsPerPage">
                        <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5</option>
                        <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="20" ${itemsPerPage === 20 ? 'selected' : ''}>20</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    tableContainer.innerHTML = tableHTML;
    
    // Re-attach event listener after rendering
    document.getElementById('itemsPerPage').addEventListener('change', onItemsPerPageChanged);
}

// Pagination functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

    detailModal.classList.add('show');
    backdrop.classList.add('show');
}

// Close modal
function closeModal() {
    detailModal.classList.remove('show');
    backdrop.classList.remove('show');
}

// Open edit modal
function openEditModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    editingProductId = productId;
    document.getElementById('editName').value = product.name;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editImage').value = product.image;
    document.getElementById('editDescription').value = product.description;
    
    editModal.classList.add('show');
    editBackdrop.classList.add('show');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('show');
    editBackdrop.classList.remove('show');
    editingProductId = null;
}

// Save edited product
function saveProduct() {
    if (editingProductId === null) return;
    
    const product = allProducts.find(p => p.id === editingProductId);
    if (!product) return;
    
    const name = document.getElementById('editName').value.trim();
    const price = parseFloat(document.getElementById('editPrice').value);
    const image = document.getElementById('editImage').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    
    if (!name || !price || !image || !description) {
        alert('Please fill in all fields');
        return;
    }
    
    // Update product
    product.name = name;
    product.price = price;
    product.image = image;
    product.description = description;
    
    // Close modal and refresh table
    closeEditModal();
    currentPage = 1;
    displayTable();
    
    alert('Product updated successfully!');
}

// Delete product
function deleteProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        // Remove from allProducts
        allProducts = allProducts.filter(p => p.id !== productId);
        filteredProducts = filteredProducts.filter(p => p.id !== productId);
        
        // Reset pagination if needed
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        displayTable();
        alert('Product deleted successfully!');
    }
}

// Keyboard support - ESC to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);
