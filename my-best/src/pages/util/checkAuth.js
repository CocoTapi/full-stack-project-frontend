import { json, redirect } from 'react-router-dom'
import { API_URL } from '../../App';

//TODO token stores in local storage or cookies?

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
};

export function getAuthToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const tokenDuration = getTokenDuration();
    if(tokenDuration < 0) {
        return 'EXPIRED'
    };

    return token;
};

export async function userLoader () {
    const token = getAuthToken();
    if(token && token !== 'EXPIRED'){
        const { user_id, user_name } = await getUserInfoFromToken(token);
        return { token: token, user_id: user_id, user_name: user_name};
    } else if (token && token === 'EXPIRED') {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        return token;
    } 
    return token
};

export function checkAuthLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect("./auth?mode=login")
    }
    
    return null;
}


export function handleGoogleAuthEvent(event) {
    console.log("call the function!!!!!");

    // if (event.origin !== YOUR_BACKEND_URL) {
    //     console.warn('Invalid event origin');
    //     return;
    // }

    if (event.data && event.data.token) {
        // Store the token
        localStorage.setItem('token', event.data.token);
        console.log("Token stored in local storage:", localStorage.getItem('token'));
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());

        window.location.href = '/'
    } 
}


export async function getUserInfoFromToken(token){
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok) {
        throw json({message: 'Could not fetch user info.'}, {status: 500})
    }

    const resData = await response.json();
    //console.log("resData:", resData);

    const user_id = resData.data.user_id;
    const user_name = resData.data.user_name;
   
    return { user_id, user_name };
}