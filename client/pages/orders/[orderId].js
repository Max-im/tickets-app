import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const OrderItem = ({ order, currentUser }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payment',
    body: { orderId: order.id },
    onSuccess: () => router.push('/orders'),
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [order]);

  return (
    <div>
      {timeLeft < 0 && <p>Order Expired</p>}
      {timeLeft >= 0 && (
        <div>
          <p>{timeLeft} seconds left before order expires</p>
          <div>
            <StripeCheckout
              token={({ id }) => doRequest({ token: id })}
              stripeKey='pk_test_51LEuiJBIpWkQjy2dQU1Gr4XwWBtv3wsMKAwtfw7edEP8O3Ac8SFcgTl8NODpqgR6FKaiyF8aORsPDXAjbQTCAVO600x8QgN18J'
              amount={order.ticket.price * 100}
              email={currentUser.email}
            />
          </div>
          {errors}
        </div>
      )}
    </div>
  );
};

OrderItem.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderItem;
