import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const props = { ...pageProps, currentUser };
  return (
    <>
      <Header currentUser={currentUser} />
      {currentUser ? `Hi, ${currentUser.email}` : 'Hello'}
      <Component {...props} />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get('/api/users/currentuser');

  // make getInitialProps works in nested components
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
