import { createStore } from 'vuex';
import AuthService from '../services/AuthService';

// Estado inicial de la store
const initialState = {
  auth: {
    status: localStorage.getItem('authToken') ? 'success' : '',
    token: localStorage.getItem('authToken') || '',
    usuario: AuthService.getCurrentUser() || null
  }
};

// Crear y exportar la store
export default createStore({
  state: initialState,
  
  getters: {
    isAuthenticated: state => !!state.auth.token,
    authStatus: state => state.auth.status,
    userRole: state => state.auth.usuario ? state.auth.usuario.rol : null,
    getUser: state => state.auth.usuario
  },
  
  mutations: {
    AUTH_REQUEST(state) {
      state.auth.status = 'loading';
    },
    AUTH_SUCCESS(state, { token, user }) {
      state.auth.status = 'success';
      state.auth.token = token;
      state.auth.usuario = user;
    },
    AUTH_ERROR(state) {
      state.auth.status = 'error';
    },
    AUTH_LOGOUT(state) {
      state.auth.status = '';
      state.auth.token = '';
      state.auth.usuario = null;
    },
    SET_USER(state, user) {
      state.auth.usuario = user;
    }
  },
  
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST');
        AuthService.login(user)
          .then(response => {
            const token = response.data.token;
            const user = AuthService.getCurrentUser();
            localStorage.setItem('authToken', token);
            commit('AUTH_SUCCESS', { token, user });
            resolve(response);
          })
          .catch(err => {
            commit('AUTH_ERROR');
            localStorage.removeItem('authToken');
            reject(err);
          });
      });
    },
    
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('AUTH_LOGOUT');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userData');
        AuthService.logout();
        resolve();
      });
    },
    
    updateUser({ commit }, user) {
      commit('SET_USER', user);
    }
  }
});
