class AuthManager {
  constructor(api) {
    this.api = api;
    this.user = null;
  }

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} Authentication status
   */
  async checkAuthStatus() {
    try {
      console.log('Checking authentication status');
      const token = await this.api.getToken();
      
      if (!token) {
        console.log('No token found');
        return false;
      }
      
      // Verify token by getting user profile
      console.log('Token found, verifying with server');
      const user = await this.api.getUserProfile();
      this.user = user;
      console.log('User profile received:', user ? 'Yes' : 'No');
      
      return !!user;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Invalid token, clear it
      this.api.clearToken();
      return false;
    }
  }

  /**
   * Login user
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<boolean>} Login success status
   */
  async login(email, password) {
    try {
      console.log('Login attempt:', email);
      this.user = await this.api.login(email, password);
      const success = !!this.user;
      console.log('Login success:', success);
      return success;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    this.api.clearToken();
    this.user = null;
  }

  /**
   * Get current user
   * @returns {Promise<Object>} User data
   */
  async getUser() {
    if (!this.user) {
      try {
        if (await this.checkAuthStatus()) {
          return this.user;
        }
        return null;
      } catch (error) {
        console.error('Failed to get user:', error);
        return null;
      }
    }
    return this.user;
  }

  /**
   * Get user ID
   * @returns {Promise<string>} User ID
   */
  async getUserId() {
    const user = await this.getUser();
    return user ? user._id : null;
  }
}

// Create auth manager instance with API dependency
const auth = new AuthManager(api);