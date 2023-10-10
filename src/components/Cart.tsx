"use client";
import React from "react";
import { useCart } from "./CartContext";

const Cart = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart } =
    useCart();

  const totalAmount = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleDecrement = (productId: number) => {
    decrementQuantity(productId);

    const product = cart.find((item: Product) => item.id === productId);
    if (product && product.quantity == 0) {
      removeFromCart(productId);
    }
  };

  const checkout = async () => {
    await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: cart }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        if (response.url) {
          window.location.href = response.url;
          // console.log(response.url);
        }
      });
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center mb-2"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-400">
                  ${product.price.toFixed(2)} x {product.quantity}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDecrement(product.id)}
                  className="px-2 py-1 bg-red-500 text-white hover:bg-red-600 w-8 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  -
                </button>
                <button
                  onClick={() => incrementQuantity(product.id)}
                  className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 w-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <>
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Total Amount: ${totalAmount.toFixed(2)}
            </p>
          </div>

          <button
            onClick={checkout}
            className="mt-4 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Buy Now
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
