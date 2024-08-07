import { API_URL } from "../../App";
import { json, redirect } from "react-router-dom";
import { handleGoogleAuthEvent } from "../util/checkAuth";


function navigate(url) {

    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    // Open the authentication popup
    // window.open(
    //     url,
    //     'AuthWindow',
    //     `width=${width},height=${height},top=${top},left=${left}`
    // );

    const authWindow = window.open(
        url,
        'AuthWindow',
        `width=${width},height=${height},top=${top},left=${left}`
    );

    // Listener for messages from the popup window
    window.addEventListener('message', handleGoogleAuthEvent, false);

}

export async function googleOAuthAction() {
    try {
        console.log("Google auth submitted");

        const response = await fetch(`${API_URL}/oauth`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw json({ message: 'Could not generate oAuth URL.' }, { status: 500 });
        }

        const data = await response.json();
        // console.log(data);
        // console.log(data.authUrl);

        //open the authentication popup
        navigate(data.authUrl);

    } catch (error) {
        console.error('Error during Google OAuth login:', error);
    }
}