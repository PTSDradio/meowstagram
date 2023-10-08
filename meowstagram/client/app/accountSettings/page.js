"use client"
import React, {useState, useEffect, useContext} from 'react';
import AccountPost from '../../components/AccountPosts.js'
import { userContext } from '../providers/UserProvider.js';
import { useRouter } from 'next/navigation'
import {useFormik} from "formik";
import * as yup from "yup"
import {useParams} from 'next/navigation';

const accountSettings = () =>{
    const router = useRouter()
    const user = useContext(userContext)
    // console.log(user)
    let [isEdit, setIsEdit] = useState(false)
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
              const response = await fetch("http://127.0.0.1:5555/currentUser",{
                credentials: "include"
              });
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

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username"),
        first_name: yup.string().required("Must enter a first_name"),
        last_name: yup.string().required("Must enter a last_name"),
        profile_picture: yup.string().required("Must enter a profile_picture"),
        bio: yup.string(),
      })
      
      const formik = useFormik({
        initialValues: {
          username: "",
          first_name: "",
          last_name: "",
          bio: "",
          profile_picture: "",
        },
        validationSchema: formSchema, 
        onSubmit: (values) => {
          fetch('http://127.0.0.1:5555/account', {
            method: 'PATCH',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
          .then((res) => res.json())
          .then((res) => {
            // setUser(res)

            console.log(res)
          })
        console.log(values)

        }
    })



    let profileUrl = account["profile_picture"]
    let postId = account["id"]
    let posts = account['posts'];
    let postCount = posts.length;
    let followers = account['followers']
    let followersCount = followers.length
    let following = account['following']
    let followingCount = following.length
    let username = account.username;
    let fullname = account['first_name'] +" "+ account['last_name'];
    let bio = account['bio'];
    // console.log(posts.length)

    useEffect(() => {
        if (account.username!=null){
            formik.values.username = account.username;
            formik.values.first_name = account.first_name;
            formik.values.last_name = account.last_name;
            formik.values.profile_picture = account.profile_picture;
            formik.values.bio = account.bio;
            console.log("values changed!")
        }
    }, [account]);
      

    const openPost = (post) => {
        router.push("http://localhost:3000/post/" + post.id)
    }
    
    const handleDeletePost = (post) => {
        let dict = {"id": post.id}
        fetch('http://127.0.0.1:5555/post', {
            method: 'DELETE',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dict),
          })
          .then((res) => res.json())
          .then((res) => {
            // setUser(res)
            router.push('/accountSettings')
            console.log("success")
          })
    }

    let postcards = posts.map((post, i) =>{return (
        <div key={post.id}>
        <img src={post.image}  onClick={(e)=>{
            e.preventDefault
            openPost(post)
        }} alt="pikmin"/>
        <button onClick={(e)=>{
            e.preventDefault
            handleDeletePost(post)
        }}>DELETE</button>
        </div>
        )
    })



     return (isEdit?
     <div>
        <h2>Please login</h2>
        <form onSubmit={formik.handleSubmit}>
            <h4>login</h4>
            <label>
                Username
                <input
                    id="username"
                    type="text"
                    value= {formik.values.username}
                    placeholder="Enter your username"
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.username}</p>
            </label>
            <br/>
            <label>
                first_name
                <input
                    id="first_name"
                    type="text"
                    value= {formik.values.first_name}
                    placeholder="Enter your first_name"
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.first_name}</p>
            </label>
            <br/>
            <label>
                last_name
                <input
                    id="last_name"
                    type="text"
                    value= {formik.values.last_name}
                    placeholder="Enter your last_name"
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.last_name}</p>
            </label>
            <br/>
            <label>
                profile_picture
                <input
                    id="profile_picture"
                    type="text"
                    value= {formik.values.profile_picture}
                    placeholder="Enter your profile_picture"
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.profile_picture}</p>
            </label>
            <br/>
            <label>
                bio
                <input
                    id="bio"
                    type="text"
                    value= {formik.values.bio}
                    placeholder="Enter your bio"
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.bio}</p>
            </label>
            <br/>
            <button type="submit">Update Account</button>
        </form>
    </div>
:
        <div>
        <header className="account-header">
            <img src={profileUrl}></img>
            <div className='account-details'>
                <h1 className='account-username'>{username}</h1>
                <button onClick={(e)=>{
                    e.preventDefault();
                    setIsEdit(!isEdit)
                }
                }>edit</button>
                <div className='account-stats'>
                    <h2>{postCount}posts</h2>
                    <h2>{followersCount} followers</h2>
                    <h2>{followingCount}following</h2>

                </div>
                <h2 className='account-info'>{fullname}</h2>
                <p className='account-info'>{bio}</p>
            </div>
        </header>

        {postcards}

        </div>
    )

}

export default accountSettings