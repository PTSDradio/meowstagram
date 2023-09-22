
import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../app/context/UserProvider";
import { useRouter } from 'next/navigation'
import RenderComment from "./Comments"


const PostDisplay = ({props}) => {
    console.log(props)
    const router = useRouter()

    let [isLiked, setIsLiked] = useState(false)
    let [btn, setBtn] = useState("Like")
    let [comment, setComment] = useState()
    
    let user = useContext(userContext)

    let post = props['props']
    let post_id = props['id']
    let user_id = props['user_id']
    let username= props["username"]
    let likes = props['likes']
    let profile_picture = props['profile_picture']
    let image = props["image"]
    let comments = props['comments']
    let subtext = props['subtext']

    console.log(user)
    useEffect(()=>{
        let toggleLiked = async (likes) => {
            // let user = await useContext(userContext)
            if(likes.some(x => x.username == user['username'])){
                console.log("is liked")
                setIsLiked(true)
                setBtn("Dislike")
            }
            console.log(user["username"])
        }
        toggleLiked(likes)
    
    }, [user])

    const handleLike = (post_id) => {
        fetch('http://127.0.0.1:5555/like', {
            method: 'POST',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(post_id),
          })
          .then((res) => res.json())
          .then((res) => {
            console.log(res.status)
            // if (!res.ok) {
            //     throw new Error("Network response was not ok");
            //   }
            setBtn("Dislike")

            setIsLiked(true)
        })
        
    }

    const handleDislike = (post_id) => {
        fetch('http://127.0.0.1:5555/like', {
            method: 'DELETE',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(post_id),
          })
          .then((res) => res.json())
          .then((res) => {
            console.log(res.status)

            // if (!res.ok) {
            //     throw new Error("Network response was not ok");
            //   }
            setIsLiked(false)
            setBtn("Like")

        })
        
    }

    const handleAccount = (user_id) => {
        router.push("http://localhost:3000/account/" + user_id)
    }
    
    const postComment = (comment) => {
        let dict = {
            "post_id": post_id,
            "comment": comment
        }
        fetch('http://127.0.0.1:5555/comments', {
            method: 'post',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dict),
          })
          .then((res) => res.json())
          .then((res) => {
            // console.log(res.status)

            // // if (!res.ok) {
            // //     throw new Error("Network response was not ok");
            // //   }
            // setIsLiked(false)
            // setBtn("Like")
          })

    }
     
    let renderedComments = comments.map((com)=> (
        <RenderComment comment={{...com, ...com['user']}} key={com.id}/>
    ))




    return (
        <div className="post">
            <header className="post-header">
                <img src={profile_picture} alt="profile_picture"/>
                <h1 onClick={(e)=>handleAccount(user_id)}>{username}</h1>
            </header>
            <img src={image} alt="image"/>
            <div className="post-bottom">
                <h3>{subtext}</h3>
                <button onClick={isLiked? 
                (e) =>handleDislike({"post_id": post_id}) :
                (e) =>handleLike({"post_id": post_id})
                }>{btn}</button>
                {renderedComments}
                <form onSubmit={(e)=> {
                    postComment(comment)

                    }}>
                    <label>Add a Comment:
                        <input
                            type="text"
                            id="comment"
                            placeholder="Type your comment..."
                            onChange={(e)=> {
                                e.preventDefault()
                                setComment(e.target.value)}}
                        />
                    </label>
                    <button type="submit">post comment</button>
                </form>
            </div>

        </div>
    )

}


export default PostDisplay

