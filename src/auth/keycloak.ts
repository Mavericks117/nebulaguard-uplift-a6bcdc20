import Keycloak from 'keycloak-js';

// Keycloak configuration from environment variables
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'Jarvis',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'react-frontend',
};

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

// Token refresh configuration
export const REFRESH_TOKEN_MIN_VALIDITY = 60; // seconds before expiry to refresh

// Keycloak initialization options for PKCE flow
export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  pkceMethod: 'S256' as const,
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
};
