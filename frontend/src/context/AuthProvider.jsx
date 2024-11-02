// This file is used to manage login, logout states in various pages globally.

import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [blogs, setBlogs] = useState()
    const [profile, setProfile] = useState()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let parsedToken = localStorage.getItem("jwt");
                //console.log(parsedToken);

                if (parsedToken) {
                    const { data } = await axios.get("http://localhost:4001/api/users/my-profile", { // 'axios' is used to call backend APIs (http request)
                        withCredentials: true, // includes cookies in the request
                        headers: { 'Content-Type': 'application/json' },
                    })
                    console.log(data)
                    setProfile(data.user)
                    setIsAuthenticated(true)
                }                
            } catch (error) {
                console.log(error)
            }
        }

        const fetchBlogs = async () => {            
            try {
                const { data } = await axios.get("http://localhost:4001/api/blogs/all-blogs", { // 'axios' is used to call backend APIs (http request)
                    withCredentials: true, // includes cookies in the request
                    headers: { 'Content-Type': 'application/json' },
                })
                console.log(data)
                setBlogs(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchBlogs();
        fetchProfile();
    }, [])

    return (
        <AuthContext.Provider value={{ blogs, profile, setProfile, isAuthenticated, setIsAuthenticated }}> 
            { children } 
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext); // by 'useAuth', we can access 'blogs' through out the react app
