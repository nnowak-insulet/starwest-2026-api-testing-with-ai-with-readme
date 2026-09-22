const products = require('../models/product.model');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout({ items, paymentMethod }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Items array is required and must not be empty');
    error.status = 400;
    throw error;
  }

  if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    const error = new Error('Payment method must be cash or credit_card');
    error.status = 400;
    throw error;
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity < 1) {
      const error = new Error('Each item must have a valid productId and quantity >= 1');
      error.status = 400;
      throw error;
    }

    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      const error = new Error(`Product with id ${item.productId} not found`);
      error.status = 404;
      throw error;
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: Number(lineTotal.toFixed(2))
    });
  }

  const discountRate = paymentMethod === 'cash' ? CASH_DISCOUNT_RATE : 0;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const total = Number((subtotal - discount).toFixed(2));

  return {
    items: orderItems,
    paymentMethod,
    subtotal: Number(subtotal.toFixed(2)),
    discount,
    discountRate,
    total
  };
}

module.exports = {
  checkout,
  VALID_PAYMENT_METHODS
};
