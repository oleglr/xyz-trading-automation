export interface OAuthConfig {
  clientId: string;
  scope: string;
  redirectUri: string;
  authUrl: string;
}

export interface OAuthResponse {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}
