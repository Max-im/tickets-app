const Orders = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(({ id, ticket, status }) => (
          <li key={id}>
            {ticket.title} - {status}
          </li>
        ))}
      </ul>
    </div>
  );
};

Orders.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default Orders;
