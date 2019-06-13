// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store/reducers';
import App from './App';

const cache = new InMemoryCache();
const API_POKEMON_URL = 'https://graphql-pokemon.now.sh';

const httpLink = new HttpLink({
  uri: API_POKEMON_URL
});

const client = new ApolloClient({
  link: httpLink,
  cache,
});

const store = createStore(rootReducer);


ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>, document.getElementById('root'));