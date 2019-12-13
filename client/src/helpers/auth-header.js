export function authHeader() {
    // return authorization header with basic auth credentials
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.accessToken) {
        return {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': currentUser.accessToken
        };
    } else {
        return {};
    }
}
