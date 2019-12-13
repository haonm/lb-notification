import {API_URL} from '../configs';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const userService = {
    login,
    logout,
    getAll,
    getUser
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${API_URL}/api/users/login`, requestOptions)
        .then(handleResponse)
        .then(async (res) => {
            if (res) {
                localStorage.setItem('currentUser', JSON.stringify({
                  id: res.userId,
                  email: email,
                  accessToken: res.id
                }));
            }

            return res;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${API_URL}/api/users`, requestOptions).then(handleResponse);
}

function getUser(userId) {
  const requestOptions = {
      method: 'GET',
      headers: authHeader()
  };

  return fetch(`${API_URL}/api/users/${userId}`, requestOptions).then(handleResponse);
}
