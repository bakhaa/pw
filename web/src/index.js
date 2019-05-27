import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { SnackbarProvider } from 'notistack';

import * as serviceWorker from './serviceWorker';
import { client } from './apollo';
import Routes from './routes';
// import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <SnackbarProvider maxSnack={3}>
      <Routes />
    </SnackbarProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
