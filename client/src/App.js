import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Authservice from './utils/auth';
import 'semantic-ui-css/semantic.min.css'
import NavTabsHome from "./components/NavTabsHome";
import Home from '../src/components/pages/Home';
import Login from '../src/components/pages/Login';
import Signup from '../src/components/pages/Signup';
import NavTabsDashboard from '../src/components/NavTabsDashboard';

import ViewAllPosts from '../src/components/pages/ViewAllPosts';
import ViewMyPosts from '../src/components/pages/ViewMyPosts'
import CreatePost from "./components/pages/CreatePost";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
  } from '@apollo/client';
  import { setContext } from '@apollo/client/link/context';
 
  const httpLink = createHttpLink({
    uri: '/graphql',
  });
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

function App() {
const [loggedIn, setLoggedIn] = useState(false)
useEffect(() =>{
let isLoggedIn = Authservice.loggedIn()
setLoggedIn(isLoggedIn)
},[])

    // do graphQL Query me to see if u r logged in rn 
    // var loggedIn = false

    return (
        <ApolloProvider client= { client }>
       
        <Router>
        {loggedIn ? (<NavTabsDashboard />) : (<NavTabsHome />)}
          
          {loggedIn?
               <Switch>
              
                {/* <Redirect exact path={["/", "/login"]} to="/dashboard" />
                <Redirect exact path={["/", "/signup"]} to="/dashboard" /> */}
                <Route exact path='/home' component={Home} />
                <Route exact path='/viewallposts' component={ViewAllPosts} />
                <Route exact path='/' component={ViewAllPosts} />
                <Route exact path='/viewmyposts' component={ViewMyPosts} />
                <Route exact path='/createpost' component={CreatePost} />
                <Route render={() => <Redirect to="/" />}/>
                </Switch>
                :
                <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
                <Route render={() => <Redirect to="/" />}/>
                </Switch>}
        </Router>
      
        </ApolloProvider>
    )
}

export default App;