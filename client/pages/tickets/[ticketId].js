import useRequest from '../../hooks/useRequest';

const TicketItem = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    body: { ticketId: ticket.id },
    onSuccess: (order) => console.log(order, 'order'),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className='btn btn-primary' onClick={doRequest}>
        Purchase
      </button>
    </div>
  );
};

TicketItem.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketItem;
