'use client'
import { useState, createContext , useEffect} from "react";

export const userContext = createContext()

const UserProvider = ({children}) => {
    const[user, setUser] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch("http://127.0.0.1:5555/currentUser", {
                credentials: "include"
              })
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const userData = await response.json();
              setUser(userData); // Update the comments state with the fetched data
            } catch (error) {
              console.error("Error fetching data:", error);
            }
        };
        fetchData();   
    }, [])

    return (
        <userContext.Provider value={user} >
            {children}
        </userContext.Provider>
    )
}

export default UserProvider