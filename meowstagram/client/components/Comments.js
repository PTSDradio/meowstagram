
import React, {useState, useEffect} from "react";



function RenderComment ({comment})  {
    let profile_picture = comment["profile_picture"]
    let username = comment["username"]
    let text = comment["comment"]

    const handleclick = (e) => {
        
    }

    console.log(text)
    return (
        <div className="comment-container">
            <div className="comment-body" onClick={handleclick()}>
                <div className="comment-header">
                    <img src={profile_picture} alt="profile-picture"/>
                    <h3>{username}</h3>
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



