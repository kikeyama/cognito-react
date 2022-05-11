import { useState, useEffect } from 'react';
import logo from '../logo.svg';
import '../App.css';
import Amplify, { Auth } from 'aws-amplify';

const apiIdentifier = process.env.REACT_APP_API_IDENTIFIER;
const customScopes = process.env.REACT_APP_CUSTOM_SCOPES.split(' ').map(scope => `${apiIdentifier}/${scope}`);

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ['email', 'profile', 'openid'].concat(customScopes),
      redirectSignIn: process.env.REACT_APP_LOGIN_URL,
      redirectSignOut: process.env.REACT_APP_LOGOUT_URL,
      responseType: 'code',
    },
  },
});

function App() {
  const [user, setUser] = useState();

  const signIn = async () => {
      try {
          await Auth.federatedSignIn();
      } catch (error) {
          console.log('error signing in: ', error);
      }
  }
  
  const signOut = async () => {
      try {
          await Auth.signOut();
          setUser(null);
      } catch (error) {
          console.log('error signing out: ', error);
      }
  }

  const getUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });
      return userData;
    } catch(error) {
      console.log('ERROR: ' + error);
    }
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then(userData => {
      console.log(userData);
      setUser(userData);
    }).catch(error => {
      console.log('ERROR: ' + error);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {user ? (
            <a
              className="App-link"
              rel="noopener noreferrer"
              href="#"
              onClick={() => signOut()}
            >
              Logout
            </a>
          ) : (
            <a
              className="App-link"
              rel="noopener noreferrer"
              href="#"
              onClick={() => signIn()}
            >
              Login
            </a>
          )
          }
        </div>
      </header>
    </div>
  );
}

export default App;
