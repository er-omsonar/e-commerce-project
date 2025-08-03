import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart } from "../data/cart.js";
renderOrderSummary();
renderPaymentSummary();
export function updateCartQuantity() {
  let cartQuantity = 0;
cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
    
  });

  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();