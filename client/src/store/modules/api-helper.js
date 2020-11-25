export const config = {
    headers: { 
        'auth-token': localStorage.getItem('token'),
        Accept: 'application/json'
    }
};

export const api_url = "http://localhost:3000/api";
 