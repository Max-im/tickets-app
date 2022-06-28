import React from 'react';

const Index = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1>
    </div>
  );
};

Index.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default Index;
