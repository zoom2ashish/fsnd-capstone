import axios from './axios';

export interface CurrentUserData {
  lastRefresh: Number; // In milliseconds
  authToken: String;
  expiresIn: number;
};

export function getUser() {
  let user_data = localStorage.getItem('user_data') || "{}";
  let currentUser: CurrentUserData = JSON.parse(user_data);

  // If User not found
  if (!currentUser) {
    return Promise.resolve(null);
  }

  let now = new Date();
  let diff = now.getTime() - (currentUser.lastRefresh as number);
  if (diff >= (currentUser.expiresIn * 1000)) {
    // Call refresh token or redirect to users page

  } else {
    axios.defaults.headers.common['Authorization'] = `Bearer ${currentUser.authToken}`;

    axios.interceptors.response.use(
      response => response,
      error => {
        console.log('Errors');
      });
  }
}
