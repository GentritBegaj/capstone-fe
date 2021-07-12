import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const PUBLIC_KEY =
  'pk_test_51J5VhhCItOSpr3ZouWdQ3Q3asgeWX0leVm2ohWW3tlAjM5kkPRfJdThwvJHSFLtkG3tSUst2X7k0BCqMDY4x7u7h00WOBWnkRt';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripeContainer;
