
import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../app/providers/UserProvider";
import { useRouter } from 'next/navigation'
import {Avatar} from "@nextui-org/react";

function RenderComment ({comment})  {
    let router = useRouter()
    let user = useContext(userContext)
    let profile_picture = comment["profile_picture"]
    let username = comment["username"]
    let text = comment["comment"]
    let user_id = comment["user_id"]

    const handleDeleteComment = (commentId) => {
        let dict = {"comment_id": commentId}
        fetch('http://127.0.0.1:5555/comments', {
            method: 'DELETE',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dict),
          })

          .then((res) => {
            window.location.reload(false)
          })
    }




    const handleclick = (user_id) => {
        router.push("http://localhost:3000/account/" + user_id)
    }

    // console.log(text)
    return (
        <div className="comment-container">
            <div className="comment-body" >
                <div className="comment-header">
                <Avatar src={profile_picture} size="lg" />
                    <h3 onClick={(e)=> {
                        e.preventDefault();
                        handleclick(user_id)
                        }}>{username}</h3>
                </div>
                <p>{text}</p>
                {user?(user.id == user_id?<button onClick={(e)=> {
                        handleDeleteComment(comment["id"])
                        }}
                        >delete</button> : null):null}
            </div>
        </div>
    )

}


export default RenderComment


// import React, {useState, useEffect} from "react";



// function comment (props)  {
    
//     // let profile_picture = props["profile_picture"]
//     // let username = props["username"]
//     // let text = props["comment"]
//     let allComments = props.map((comment) => {
//         let profile_picture = comment["profile_picture"]
//         let username = comment["username"]
//         let text = comment["comment"]
//         return (
//         <div className="comment-container">
//             <div className="comment-header">
//                 <img src={profile_picture}/>
//                 <h3>{username}</h3>
//             </div>
//             <p>{text}</p>
//         </div>
//     )})


//     console.log("im being used")
//     return (
//         <allComments/>
//     )

// }


// export default comment



