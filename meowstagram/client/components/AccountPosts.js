'use client'
import React, {useState, useContext} from 'react';
import { useRouter } from 'next/navigation'
// show just the images of posts
function AccountPost ({posts}) {
    const router = useRouter()

    const openPost = (post) => {
        router.push("http://localhost:3000/post/" + post.id)
    }

    let postcards = posts.map((post, i) =>
    <img src={post.image} key={post.id} onClick={(e)=>{
        e.preventDefault
        openPost(post)
    }} alt="pikmin"></img>)

    return (
        <div className="account-posts">
          {postcards}
        </div>
    )
}

export default AccountPost

