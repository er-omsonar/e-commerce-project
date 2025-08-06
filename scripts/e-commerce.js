
import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// Function to update cart quantity in header
function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// Function to render the list of products
function renderProducts(productList) {
  let productsHTML = '';

  productList.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            ${[...Array(10).keys()].map(i => `<option value="${i + 1}" ${i === 0 ? 'selected' : ''}>${i + 1}</option>`).join('')}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  const container = document.querySelector('.js-products-grid');
  container.innerHTML = productsHTML;

  // Re-attach add to cart buttons
  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const quantity = parseInt(quantitySelector.value);

        addToCart(productId, quantity);
        updateCartQuantity();

        const addedMessage = document.querySelector(`.added-to-cart-${productId}`);
        addedMessage.classList.add('added-to-cart-visible');

        setTimeout(() => {
          addedMessage.classList.remove('added-to-cart-visible');
        }, 2000);
      });
    });
}

// Initial render of all products
renderProducts(products);
updateCartQuantity();

// Search functionality
const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');

function searchProducts(keyword) {
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(keyword.toLowerCase()) ||
    (product.keywords && product.keywords.some(k =>
      k.toLowerCase().includes(keyword.toLowerCase())
    ))
  );

  renderProducts(filtered);
}

// Search on button click
if (searchButton && searchBar) {
  searchButton.addEventListener('click', () => {
    const keyword = searchBar.value.trim();
    searchProducts(keyword);
  });

  // Search on Enter key
  searchBar.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const keyword = searchBar.value.trim();
      searchProducts(keyword);
    }
  });
}
