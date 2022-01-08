import React, { createContext, ReactNode, useContext, useState } from 'react'

import * as AuthSession from 'expo-auth-session'

const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

interface userProps {
    id: string,
    name: string,
    firstName: string,
    email: string,
    photo?: string,
}

interface AuthContextData{
    user: userProps,
    SignInWithGoogle(): Promise<void>,
}

interface AuthorizationResponse{
    params: {
        access_token: string;
    },
    type: string;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState({} as userProps)

    async function SignInWithGoogle(){
        try {
            const CLIENT_ID = '286332456696-dd8t2s04os7tuing6lrl8684eg5sb6o6.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@dfrance/gofinances';
            const RESPONSE_TYPE= 'token';
            const SCOPE= encodeURI('profile email');

            const authUrl = `http://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
            
            const {type, params} = await AuthSession.startAsync({authUrl}) as AuthorizationResponse
            if(type == 'success'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json()
                
                setUser({
                    id: userInfo.id,
                    email: userInfo.email,
                    firstName: userInfo.given_name,
                    name: userInfo.name,
                    photo: userInfo.picture,
                })
            }
        } catch(error) {
            throw new Error(error)
        }
    }

    return (
        <AuthContext.Provider value={{user, SignInWithGoogle}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }