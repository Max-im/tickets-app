import React from 'react';

const Index = ({ currentUser, tickets }) => {
  return (
    <div>
      <h1>Tickets:</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(({ id, title, price }) => (
            <tr key={id}>
              <td>{title}</td>
              <td>{price}</td>
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
