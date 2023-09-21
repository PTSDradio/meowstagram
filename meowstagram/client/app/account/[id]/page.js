"use client"
import React, {useState, useEffect, useContext} from 'react';
import AccountPost from '../../../components/AccountPosts.js'
import { userContext } from '../../context/UserProvider.js';
import {useParams} from 'next/navigation';

const account = () =>{
    const user = useContext(userContext)
    console.log(user)

    let [account, setAccount]= useState({
        "posts":[],
    "followers":[],
    "following":[],
    "likes":[]

})
    const params = useParams()
    const id = parseInt(params["id"])

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch("http://127.0.0.1:5555/account/" + id);
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const accountData = await response.json();
            //   console.log(accountData)
              setAccount({...accountData,...accountData["user"]}); // Update the comments state with the fetched data
            } catch (error) {
              console.error("Error fetching data:", error);
            }
        };
        fetchData();   
    },[]);

    let profileUrl = account["profile_picture"]
    let posts = account['posts'];
    let postCount = posts.length;
    let followers = account['followers']
    let followersCount = followers.length
    let following = account['following']
    let followingCount = following.length
    let username = account['username'];
    let fullname = account['first_name'] +" "+ account['last_name'];
    let bio = account['bio'];
    // console.log(posts.length)
    return (
        <div>
        <header className="account-header">
            <img src={profileUrl}></img>
            <div className='account-details'>
                <h1 className='account-username'>{username}</h1>
                <div className='account-stats'>
                    <h2>{postCount}posts</h2>
                    <h2>{followersCount} followers</h2>
                    <h2>{followingCount}following</h2>

                </div>
                <h2 className='account-info'>{fullname}</h2>
                <p className='account-info'>{bio}</p>
            </div>
        </header>
        <AccountPost posts = {posts}>

        </AccountPost>
        </div>
    )
}

export default account