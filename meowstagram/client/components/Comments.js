
import React, {useState, useEffect} from "react";
import { useRouter } from 'next/navigation'

function RenderComment ({comment})  {
    let router = useRouter()

    let profile_picture = comment["profile_picture"]
    let username = comment["username"]
    let text = comment["comment"]
    let user_id = comment["user_id"]

    const handleclick = (user_id) => {
        router.push("http://localhost:3000/account/" + user_id)
    }

    console.log(text)
    return (
        <div className="comment-container">
            <div className="comment-body" >
                <div className="comment-header">
                    <img src={profile_picture} alt="profile-picture"/>
                    <h3 onClick={(e)=> handleclick(user_id)}>{username}</h3>
                </div>
                <p>{text}</p>
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



