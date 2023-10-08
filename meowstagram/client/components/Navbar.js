'use client'
import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../app/providers/UserProvider";
import { useRouter } from 'next/navigation'
import RenderComment from "./Comments"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
// import Link from 'next/link';
import { Router } from "next/router";



const Navibar = () => {
    let router = useRouter()
    let user = useContext(userContext)
    let [feed, setFeed] = useState([])


    // console.log(user)

    let handleLogout = () => {
        fetch('http://127.0.0.1:5555/logout', {
            method: 'POST',
            credentials: "include", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(null)
          })
          .then((res) => res.json())
          .then((res) => {
            router.push("/")
            // window.location.reload()
            // if (!res.ok) {
            //     throw new Error("Network response was not ok");
            //   }
            // setBtn("Dislike")

            // setIsLiked(true)
        })

    }

    return (
      <Navbar shouldHideOnScroll>
        <NavbarBrand>
          <p className="font-bold text-inherit">Meowstagram</p>
        </NavbarBrand>
        {user?<NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="/search" aria-current="page">
              search
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/create">
              create
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/accountSettings">
              account
            </Link>
          </NavbarItem>
        </NavbarContent>: null};
        {user? 
          <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/accountSettings">Account</Link>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" onClick={(e)=>handleLogout()} variant="flat">
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
        :
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>}
      </Navbar>
    );
    // return (
    //     <div>
    //     <h1>Meowstagram</h1>
    //     {user? 
    //     <div className="navbar">
    //       <Link href="/">Home</Link>
    //       <br/>
    //       <Link href="/search">search</Link>
    //       <br/>
    //       <Link href="/create">create</Link>
    //       <br/>
    //       <Link href="/accountSettings">account</Link>
    //       <button onClick={(e)=>handleLogout()}>logout</button>
    //     </div>: null}
    //     </div>
    // )

}


export default Navibar

