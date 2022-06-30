import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const TicketItem = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    body: { ticketId: ticket.id },
    onSuccess: ({ id }) => router.push(`/orders/${id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className='btn btn-primary' onClick={() => doRequest()}>
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
