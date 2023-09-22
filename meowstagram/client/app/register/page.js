'use client'
import React,{useState, useEffect} from 'react';
import {useFormik} from "formik";
import * as yup from "yup"

const page_name = () =>{
    // let [user, setUser] = useState({})

    const formSchema = yup.object().shape({
        first_name: yup.string().required("Must enter a first name"),
        last_name: yup.string().required("Must enter a last name"),
        username: yup.string().required("Must enter a username"),
        password: yup.string().required("Must enter a password")
      })
      
      const formik = useFormik({
        initialValues: {
          first_name: "",
          last_name: "",
          username: "",
          password: "", 
        },
        validationSchema: formSchema, 
        onSubmit: (values) => {
          fetch('http://127.0.0.1:5555/account', {
            method: 'POST', 
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
                <h4>Register</h4>
                <label>
                    First Name:
                    <input
                        id="first_name"
                        type="text"
                        value= {formik.values.first_name}
                        placeholder="Enter your first name"
                        onChange={formik.handleChange}
                    />
                </label>
                <p style={{ color: "red" }}> {formik.errors.first_name}</p>
                <br/>
                <label>
                    Last Name:
                    <input
                        id="last_name"
                        type="text"
                        value= {formik.values.last_name}
                        placeholder="Enter your last name"
                        onChange={formik.handleChange}
                    />
                </label>
                <p style={{ color: "red" }}> {formik.errors.last_name}</p>
                <br/>
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
                <p style={{ color: "red" }}> {formik.errors.username}</p>
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
                <p style={{ color: "red" }}> {formik.errors.password}</p>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default page_name