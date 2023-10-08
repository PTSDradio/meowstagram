
import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../app/providers/UserProvider";
import { useRouter } from 'next/navigation'
import {Divider, Avatar, AvatarGroup, AvatarIcon, Textarea, Image} from "@nextui-org/react";
import RenderComment from "./Comments"


const PostDisplay = ({props}) => {
    // console.log(props)
    const router = useRouter()

    let [isLiked, setIsLiked] = useState(false)
    let [btn, setBtn] = useState("Like")
    let [comment, setComment] = useState()
    // let [allComments, setAllComments] = useState(props.comments)
    
    let user = useContext(userContext)

    let post = props['props']
    let post_id = props['id']
    let user_id = props['user_id']
    let username= props["username"]
    let likes = props['likes']
    let profile_picture = props['profile_picture']
    let image = props["image"]
    let subtext = props['subtext']

    useEffect(()=>{
        let toggleLiked = async (likes) => {
            // let user = await useContext(userContext)
            if(likes.some(x => x.username == user['username'])){
                console.log("is liked")
                setIsLiked(true)
                setBtn("Dislike")
            }
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
            
            // setAllComments([
            //     ...allComments, 
            //     {
            //         "comment": comment,
            //         "username": username,
            //         "user_id": user_id
            //     }
            // ])
          })

    }
     
    let renderedComments = props.comments.map((com)=> (
        <RenderComment comment={{...com, ...com['user']}} key={com.id}/>
    ))




    return (
        <div className="post">
            <header className="post-header">
            <Avatar src={profile_picture} size="lg" />
                <h1 onClick={(e)=>handleAccount(user_id)}>{username}</h1>
            </header>
            <Image
                src={image}
                // width={400}
                alt="NextUI hero Image with delay"
                radius="sm"
                shadow=""
                className="post-content"/>
            <div className="post-footer">

                <button onClick={isLiked? 
                (e) =>handleDislike({"post_id": post_id}) :
                (e) =>handleLike({"post_id": post_id})
                }>{btn}</button>
                <h3>{subtext}</h3>
                {renderedComments}
                <form onSubmit={(e)=> {
                    postComment(comment)

                    }}>
                    <label>Add a Comment:
                        <Textarea
                            id="comment"
                            placeholder="Type your comment..."
                            onChange={(e)=> {
                                e.preventDefault()
                                setComment(e.target.value)}}
                                className="max-w-xs"
                        />
                    </label>
                    <button type="submit">post comment</button>
                </form>
            </div>
            {/* <Divider className="divider" /> */}
        </div>
    )

}


export default PostDisplay

