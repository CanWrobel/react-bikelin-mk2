import Keycloak from 'keycloak-js';

// Direkte Konfiguration mit festen Werten
const keycloakConfig = {
  url: 'http://141.45.146.183:8090/auth',
  realm: 'BikeNavigator',
  clientId: 'AngularBikeNavigator',
  redirectUri: 'http://localhost:4200', // Stelle sicher, dass dies mit den Keycloak-Einstellungen übereinstimmt
  postLogoutRedirectUri: 'http://localhost:4200', // Stelle sicher, dass dies mit den Keycloak-Einstellungen übereinstimmt
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = () => {
  return keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false
  });
};

export default keycloak;
