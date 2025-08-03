import { saveToStorage } from '../../data/cart.js';
import { cart, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { updateCartQuantity } from '../checkout.js';

export function renderOrderSummary() {
  let cartSummaryHtml = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    // Quantity dropdown
    const quantityOptions = Array.from({ length: 10 }, (_, i) => {
      const quantity = i + 1;
      return `
        <option value="${quantity}" ${quantity === cartItem.quantity ? 'selected' : ''}>
          ${quantity}
        </option>
      `;
    }).join('');

    cartSummaryHtml += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>
                Quantity:
                <select class="js-quantity-selector quantity-selector" data-product-id="${matchingProduct.id}">
                  ${quantityOptions}
                </select>
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    return deliveryOptions.map((option) => {
      const deliveryDate = dayjs().add(option.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = option.priceCents === 0 ? 'FREE' : `$${formatCurrency(option.priceCents)} -`;
      const isChecked = option.id === cartItem.deliveryOptionId;

      return `
        <div class="delivery-option js-delivery-option"
             data-product-id="${matchingProduct.id}"
             data-delivery-option-id="${option.id}">
          <input type="radio"
                 class="delivery-option-input"
                 name="delivery-option-${matchingProduct.id}"
                 ${isChecked ? 'checked' : ''}>
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
      `;
    }).join('');
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;

  // Delete item
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      renderOrderSummary();
      renderPaymentSummary();
      updateCartQuantity();
    });
  });

  // Change delivery option
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Update quantity
  document.querySelectorAll('.js-quantity-selector').forEach((selector) => {
    selector.addEventListener('change', () => {
      const productId = selector.dataset.productId;
      const newQuantity = Number(selector.value);

      const matchingItem = cart.find((item) => item.productId === productId);
      if (matchingItem) {
        matchingItem.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderOrderSummary();
        renderPaymentSummary();
        updateCartQuantity();
      }
    });
  });
}
