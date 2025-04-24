import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm"; // Créez un formulaire de paiement séparé

const stripePromise = loadStripe("pk_test_51RHPa5PGabkADWPTO8eWUHAsOqhChVVk2qwCr3PIABidvOYkyHU48SbjeBvH8pM6lYwSW9qbVO0OOAhqYMUa7SqS00mYzleWGR");
                                                                                                                      
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;