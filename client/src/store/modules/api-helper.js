
export function setToken (){
    const config = {
            headers: { 
                'auth-token': localStorage.getItem('token'),
                Accept: 'application/json'
            }
        };
    return config;    
}

export function setclientToken (){
    const config = {
            headers: { 
                'auth-token': localStorage.getItem('clienttoken'),
                Accept: 'application/json'
            }
        };
    return config;    
}

export const api_url = "http://localhost:3000/api";
 