'use client'

import React, {useEffect, useState, useContext} from 'react';
import { userContext } from '../../providers/UserProvider.js';
import {useParams} from 'next/navigation';
import PostDisplay from '../../../components/PostDisplay.js';
import comment from '../../../components/Comments.js';

const post= () =>{
    let [postInfo, setPostInfo] = useState({
      "comments":[],
      "likes":[],
    })
    let user = useContext(userContext)
    const params = useParams()
    const id = parseInt(params["id"])


    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch("http://127.0.0.1:5555/post/" + id);
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const postData = await response.json();
              setPostInfo({...postData, ...postData["user"]}); // Update the comments state with the fetched data
            } catch (error) {
              console.error("Error fetching data:", error);
            }
        };
        fetchData();   
    },[]);

    return (
        <div>
            <PostDisplay props={postInfo}/>
        </div>
    )
}

export default post