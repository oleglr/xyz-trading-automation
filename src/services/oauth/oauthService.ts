class OAuthService {
  private authUrl: string;
  private appId: string;

  constructor() {
    this.authUrl = import.meta.env.VITE_OAUTH_URL;
    this.appId = import.meta.env.VITE_OAUTH_APP_ID;
  }

  public initiateLogin(): void {
    const params = new URLSearchParams({
      app_id: this.appId,
      l: 'en',
      route: window.location.pathname,
    });

    window.location.href = `${this.authUrl}?${params.toString()}`;
  }

  public getAuthParams(): Record<string, string> | null {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    
    // Clean up URL after extracting parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return Object.keys(params).length > 0 ? params : null;
  }
}

export const oauthService = new OAuthService();
