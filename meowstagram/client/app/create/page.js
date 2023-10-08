'use client'
import React,{useState, useEffect, useContext} from 'react';
import { userContext } from '../providers/UserProvider.js';
import { useRouter } from 'next/navigation';
import {useFormik} from "formik";
import * as yup from "yup"



const Create = () => {
    const user = useContext(userContext)
    const formSchema = yup.object().shape({
        image: yup.string().required("Must enter a image"),
        subtext: yup.string().required("Must enter a subtext")
      })
      
      const formik = useFormik({
        initialValues: {
          image: "",
          subtext: "", 
        },
        validationSchema: formSchema, 


        onSubmit: (values) => {
          fetch('http://127.0.0.1:5555/post', {
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
  
          //Back end - Write a function that Users/Sellers.query.filter(values.image)
          //Back end - GET request by user/seller ID.
          //Front end - Assign useState variable with user/seller items. 
        }
      })
  

    return (
        <div>
            <h2>Create a Post!</h2>
            <form onSubmit={formik.handleSubmit}>
                <h4>login</h4>
                <label>
                    image
                    <input
                        id="image"
                        type="text"
                        value= {formik.values.image}
                        placeholder="Enter your image"
                        onChange={formik.handleChange}
                    />
                    <p style={{ color: "red" }}> {formik.errors.image}</p>
                </label>
                <br/>
                <label>
                    subtext
                    <input
                        id="subtext"
                        type="text"
                        value= {formik.values.subtext}
                        placeholder="Enter your subtext"
                        onChange={formik.handleChange}
                    />
                    <p style={{ color: "red" }}> {formik.errors.subtext}</p>
                </label>
                <br/>
                <button type="submit">Post</button>
            </form>
        </div>
    )

}

export default Create;