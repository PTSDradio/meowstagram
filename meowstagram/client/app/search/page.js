'use client'

import React, {useEffect, useState, useContext} from 'react';
import { userContext } from '../context/UserProvider.js';
import {useParams} from 'next/navigation';
import { useRouter } from 'next/navigation'


const search= () =>{
    let router = useRouter()
    let [search, setSearch] = useState("")
    let [results, setResults] = useState([])
    let user = useContext(userContext)
    const params = useParams()
    const id = parseInt(params["id"])



    const handleSearch = (searchTerm) => {
        console.log(searchTerm)
        let dict = {
            "username": searchTerm,
        }
        fetch('http://127.0.0.1:5555/users/search', {
            method: 'POST',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dict),
          })
          .then((res) => res.json())
          .then((res) => {
            // if (!res.ok) {
            //     throw new Error("Network response was not ok");
            //   }
            
            console.log(res)
            setResults(res)
        })

    }
    const handleAccount = (user_id) => {
        router.push("http://localhost:3000/account/" + user_id)
    }

    let users = results.map((u)=> {
        return (
            <div>
                <image src={u["profile_picture"]}/>
                <h3 onClick={(e) => {
                    e.preventDefault();
                    handleAccount(u["id"])}}>{u["username"]}</h3>
            </div>
        )
    }) 


    
    return (
        <div>
            <input
                id="search"
                type="text"
                // value= {formik.values.username}
                placeholder="Enter your Search term "
                onChange={(e)=>handleSearch(e.target.value)}
            /> 
            {users}
        </div>
    )
}

export default search