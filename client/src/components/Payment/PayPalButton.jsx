import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onSuccess, onError, orderId }) => {
  return (
    <div className="paypal-button-container">
      <PayPalButtons
        forceReRender={[amount, orderId]} // This ensures the component rerenders when props change
        style={{ 
          layout: "vertical", 
          color: "blue", 
          shape: "rect"
        }}
        createOrder={(data, actions) => {
          console.log("Creating PayPal order...");
          return actions.order.create({
            purchase_units: [
              {
                description: `Order #${orderId.slice(-6)}`,
                amount: {
                  value: amount.toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          console.log("PayPal payment approved, capturing funds...", data);
          return actions.order.capture()
            .then(details => {
              console.log("Payment captured successfully:", details);
              onSuccess(details);
            })
            .catch(err => {
              console.error("Error capturing payment:", err);
              onError(err);
            });
        }}
        onCancel={(data) => {
          console.log("Payment cancelled by user:", data);
          onError({ message: "Payment was cancelled" });
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          onError(err);
        }}
      />
    </div>
  );
};

export default PayPalButton;