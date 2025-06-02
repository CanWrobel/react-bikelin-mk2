import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://141.45.191.145:8090/auth',
  realm: 'BikeNavigator',
  clientId: 'AngularBikeNavigator',
  redirectUri: 'http://localhost:4200', 
  postLogoutRedirectUri: 'http://localhost:4200', 
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = () => {
  return keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false
  });
};

export default keycloak;
