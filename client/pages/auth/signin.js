import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    body: { email, password },
    url: '/api/users/signin',
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign In</button>
    </form>
  );
}
