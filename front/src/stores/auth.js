import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),
  
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user
  },
  
  actions: {
    setAuth(value) {
      this.isAuthenticated = value;
    },
    
    setUser(user) {
      this.user = user;
    },
    
    login(user) {
      this.isAuthenticated = true;
      this.user = user;
    },
    
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    }
  }
}); 