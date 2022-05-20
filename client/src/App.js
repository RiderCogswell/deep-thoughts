import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
// essentially this allows us to create a middleware function see line 24
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import SingleThought from './pages/SingleThought';
import NoMatch from './pages/NoMatch';

const httpLink = createHttpLink({
  // need am absolute path because react runs on port 3000 but the server runs on 3001, so we have to explicitly define its path for development
  // uri: 'http://localhost:3001/graphql',
  // for production,
  uri: '/graphql',
});

// to retrieve the token from localstorage and set the HTTP request headers to include the token
// the first param is the current request, we dont need it so we use '_' as a placeholder
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    // set headers to recieve auth token in proper format
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
})

// update client to include both httpLink and authLink so we can automate that process instead of replacing the token manually every request
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Routes>
              <Route
                path='/'
                element={<Home />}
              />
              <Route
                path='/login'
                element={<Login />}
              />
              <Route
                path='/signup'
                element={<Signup />}
              />
              <Route
                path='/profile/:username'
                element={<Profile />}
              />
              <Route
                path='/thought/:id'
                element={<SingleThought />}
              />

              <Route 
                path='*'
                element={<NoMatch />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
};


export default App;


