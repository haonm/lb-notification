import {API_URL} from '../configs';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const messageService = {
    getAll,
    update,
};

function update(msg) {
  const requestOptions = {
      method: 'PATCH',
      headers: authHeader(),
      body: JSON.stringify({version: msg.version, content: msg.content}),
  };

  return fetch(`${API_URL}/api/messages/${msg.id}`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${API_URL}/api/messages`, requestOptions).then(handleResponse);
}
