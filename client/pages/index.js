import React from 'react';
import buildClient from '../api/build-client';

const Index = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1>
    </div>
  );
};

Index.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentuser');
  return data;
};

export default Index;
