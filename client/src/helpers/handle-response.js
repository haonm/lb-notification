export function handleResponse(response) {
  return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
          if (response.status === 401) {
              // auto logout if 401 response returned from api
              localStorage.removeItem('currentUser');
              window.location.reload(true);
          }

          const error = (data && data.message) || response.statusText;
          alert(error);
          return Promise.reject(error);
      }

      return data;
  });
}
