import axios from "axios";


const api= axios.create({
    // In production, Vercel rewrites /api/* to the backend service on the same domain.
    // VITE_API_URL can be left unset on Vercel; set it to http://localhost:3000 for local dev.
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials:true
})

export async function register({username,email,password}){

    try{
    const response = await api.post('/api/auth/register',{
        username,
        email,
        password
    })

    return response.data

    }catch(err){
        console.log(err);
    }  
}

export async function login({email,password}){

    try{
    const response = await api.post('/api/auth/login',{
        email,
        password
    })
    return response.data
    }catch(err){
        console.error(err.response?.data || err.message)
        throw err
    }  
}

export async function logout(){

    try{
    const response = await api.get('/api/auth/logout')
    return response.data
    }catch(err){
        console.log(err);
    }
}

export async function getMe(){
    const response = await api.get('/api/auth/get-me')
    return response.data
}