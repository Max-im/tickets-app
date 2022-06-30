import React from 'react';
import Link from 'next/link';

const Index = ({ currentUser, tickets }) => {
  return (
    <div>
      <h1>Tickets:</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(({ id, title, price }) => (
            <tr key={id}>
              <td>{title}</td>
              <td>{price}</td>
              <td>
                <Link href={`/tickets/${id}`}>
                  <a className='navbar-brand'>View</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Index.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default Index;
