import React, { useState } from 'react';
import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    body: { title, price },
    url: '/api/tickets',
    onSuccess: (ticket) => console.log('success', ticket),
  });

  const formatPrice = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      setPrice('');
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='form-control'
          />
        </div>

        <div className='form-group'>
          <label>Price</label>
          <input
            value={price}
            onBlur={formatPrice}
            onChange={(e) => setPrice(e.target.value)}
            className='form-control'
          />
        </div>

        <button className='btn btn-primary'>Submit</button>

        {errors}
      </form>
    </div>
  );
};

export default NewTicket;
