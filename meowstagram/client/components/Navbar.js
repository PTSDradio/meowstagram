'use client'
import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../app/context/UserProvider";
import { useRouter } from 'next/navigation'
import RenderComment from "./Comments"
import Link from 'next/link';


const Feed = () => {
    let user = useContext(userContext)
    let [feed, setFeed] = useState([])


    console.log(user)
    useEffect(()=>{
        const fetchData = async () => {
            try {
              const response = await fetch("http://127.0.0.1:5555/feed");
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const feedData = await response.json();
            //   console.log(accountData)
              setFeed(feedData); // Update the comments state with the fetched data
              console.log(feedData)
            } catch (error) {
              console.error("Error fetching data:", error);
            }
        };
        fetchData();   
    }, [])

    let handleLogout = () => {
        fetch('http://127.0.0.1:5555/logout', {
            method: 'POST',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(null)
          })
          .then((res) => res.json())
          .then((res) => {
            
            // if (!res.ok) {
            //     throw new Error("Network response was not ok");
            //   }
            // setBtn("Dislike")

            // setIsLiked(true)
        })

    }


    return (
        <div>
        <h1>Meowstagram</h1>
        <div className="navbar">
          <Link href="/">Home</Link>
          <br/>
          <Link href="/search">search</Link>
          <br/>
          <Link href="/account">account</Link>
          {user? <button onClick={handleLogout}>logout</button>: null}
        </div>
        </div>
    )

}


export default Feed

