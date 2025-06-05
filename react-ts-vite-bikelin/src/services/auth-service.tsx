// import Keycloak from 'keycloak-js';

// const keycloakConfig = {
//   url: 'http://141.45.191.145:8090/auth',
//   realm: 'BikeNavigator',
//   clientId: 'AngularBikeNavigator',
//   redirectUri: 'http://localhost:4200', 
//   postLogoutRedirectUri: 'http://localhost:4200', 
// };

// const keycloak = new Keycloak(keycloakConfig);

// export const initKeycloak = () => {
//   return keycloak.init({
//     onLoad: 'login-required',
//     checkLoginIframe: false
//   });
// };

// export default keycloak;

//----------------------------------142131

import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak.htw-app.de',
  realm: 'BikeNavigator',
  clientId: 'AngularBikeNavigator',
  redirectUri: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200', 
});

let keycloakInitCalled = false;

export const initKeycloak = (): Promise<boolean> => {
  if (keycloakInitCalled) return Promise.resolve(keycloak.authenticated ?? false);
  keycloakInitCalled = true;

  return keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false
  });
};

export default keycloak;
