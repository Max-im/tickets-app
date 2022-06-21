import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function signout() {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    body: {},
    url: '/api/users/signout',
    onSuccess: () => router.push('/'),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      {errors}
      Signing out...
    </div>
  );
}
