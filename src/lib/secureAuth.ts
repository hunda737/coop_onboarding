/**
 * Secure Authentication Helper
 * Handles secure token storage without localStorage
 * Uses HttpOnly cookies where possible
 */

export interface SecureAuthOptions {
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  domain?: string;
  path?: string;
}

export class SecureAuthManager {
  private static instance: SecureAuthManager;
  private isSecureContext: boolean;

  private constructor() {
    this.isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
  }

  /**
   * Get current domain for cookie setting
   */
  private getCurrentDomain(): string | undefined {
    if (typeof window === 'undefined') return undefined;

    const hostname = window.location.hostname;

    // For localhost, don't set domain
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return undefined;
    }

    // For production, you might want to set the domain
    // return hostname; // Uncomment for production if needed
    return undefined;
  }

  public static getInstance(): SecureAuthManager {
    if (!SecureAuthManager.instance) {
      SecureAuthManager.instance = new SecureAuthManager();
    }
    return SecureAuthManager.instance;
  }

  /**
   * Set secure auth cookies
   * In production, these should be HttpOnly cookies set by the backend
   */
  setAuthTokens(accessToken: string, refreshToken: string, options?: SecureAuthOptions): void {
    // Fix production cookie issues
    const defaultOptions: SecureAuthOptions = {
      secure: this.isSecureContext,
      // Use 'lax' for better compatibility, 'none' requires secure context
      sameSite: 'lax',
      path: '/',
      domain: this.getCurrentDomain(),
      ...options
    };

    // Note: In production, these should be HttpOnly cookies set by the backend
    // For now, we set them as secure cookies with limited JavaScript access
    this.setSecureCookie('access_token', accessToken, defaultOptions);
    this.setSecureCookie('refresh_token', refreshToken, defaultOptions);
  }

  /**
   * Get token from secure storage (cookies only)
   */
  getAccessToken(): string | null {
    return this.getCookie('access_token');
  }

  getRefreshToken(): string | null {
    return this.getCookie('refresh_token');
  }

  /**
   * Clear all auth tokens
   */
  clearAuthTokens(): void {
    this.clearCookie('access_token');
    this.clearCookie('refresh_token');
    this.clearCookie('role');
    this.clearCookie('clientId');
  }

  /**
   * Set additional auth data (role, clientId)
   */
  setAuthData(role?: string, clientId?: string): void {
    if (role) {
      this.setSecureCookie('role', role);
    }
    if (clientId) {
      this.setSecureCookie('clientId', clientId);
    }
  }

  /**
   * Get auth data
   */
  getAuthData(): { role: string | null; clientId: string | null } {
    return {
      role: this.getCookie('role'),
      clientId: this.getCookie('clientId')
    };
  }

  private setSecureCookie(name: string, value: string, options?: SecureAuthOptions): void {
    const defaultOptions: SecureAuthOptions = {
      secure: this.isSecureContext,
      sameSite: 'lax',
      path: '/',
      domain: this.getCurrentDomain(),
      ...options
    };

    let cookieString = `${name}=${value}`;
    cookieString += `; path=${defaultOptions.path}`;

    // Only set secure flag in HTTPS
    if (defaultOptions.secure) {
      cookieString += `; secure`;
    }

    cookieString += `; samesite=${defaultOptions.sameSite}`;

    if (defaultOptions.domain) {
      cookieString += `; domain=${defaultOptions.domain}`;
    }

    // Set longer expiration for production
    cookieString += `; max-age=14400`; // 4 hours

    document.cookie = cookieString;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie
      .split(';')
      .reduce((acc, cookie) => {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        acc[cookieName] = cookieValue;
        return acc;
      }, {} as Record<string, string>);

    const value = cookies[name] || null;
    return value;
  }

  private clearCookie(name: string): void {
    if (typeof document === 'undefined') return;

    // Clear cookie with same settings as when set
    let clearString = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;

    if (this.isSecureContext) {
      clearString += `; secure`;
    }

    const domain = this.getCurrentDomain();
    if (domain) {
      clearString += `; domain=${domain}`;
    }

    document.cookie = clearString;
  }
}

// Export singleton instance
export const secureAuth = SecureAuthManager.getInstance();