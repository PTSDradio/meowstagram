'use client'
import React,{useState, useEffect, useContext} from 'react';
import { userContext } from '../context/UserProvider.js';
import {useFormik} from "formik";
import * as yup from "yup"
import { useRouter } from 'next/navigation';

const login = () =>{
    let [user, setUser] = useState({})
    const router = useRouter()

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username"),
        password: yup.string().required("Must enter a password")
      })
      
      const formik = useFormik({
        initialValues: {
          username: "",
          password: "", 
        },
        validationSchema: formSchema, 
        onSubmit: (values) => {
          fetch('http://127.0.0.1:5555/login', {
            method: 'POST',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
          .then((res) => res.json())
          .then((res) => {
            // setUser(res)
            router.push('/')
            console.log(res)
          })
          // .then((data) => console.log(data))
  
          //Back end - Write a function that Users/Sellers.query.filter(values.username)
          //Back end - GET request by user/seller ID.
          //Front end - Assign useState variable with user/seller items. 
        }
      })
  

    return (
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
                </label>
                <br/>
                <label>
                    Password
                    <input
                        id="password"
                        type="password"
                        value= {formik.values.password}
                        placeholder="Enter your password"
                        onChange={formik.handleChange}
                    />
                </label>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default login