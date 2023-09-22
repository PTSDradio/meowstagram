
import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../app/context/UserProvider";
import { useRouter } from 'next/navigation'
import RenderComment from "./Comments"
import PostDisplay from "./PostDisplay";


const Feed = () => {
    let user = useContext(userContext)
    let [feed, setFeed] = useState([{
         "user": [],
         "comments":[]
         
}])



    useEffect(()=>{
        const fetchData = async () => {
            try {
              const response = await fetch("http://127.0.0.1:5555/feed", {
                credentials: "include", 
              });
            //   if (!response.ok) {
            //     throw new Error("Network response was not ok");
            //   }
              const feedData = await response.json();
            //   console.log(accountData)
              setFeed(feedData); // Update the comments state with the fetched data
            //   console.log(feedData)
            } catch (error) {
              console.error("Error fetching data:", error);
            }
        };
        fetchData();   
    }, [])

    let posts = feed.map((post)=> (
        <PostDisplay props={post} key={post["id"]}/>
    ))
    // console.log(posts)

    return (
        <div>
            {posts}
        </div>
    )

}


export default Feed

