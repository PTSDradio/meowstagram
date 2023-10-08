"use client"
import Image from 'next/image'
import React, {useContext, useEffect} from 'react'
import { userContext } from './providers/UserProvider'
import Feed from '../components/Feed'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  let router = useRouter()
  const user = useContext(userContext)
  useEffect(()=>{
    router.refresh()
  },[user])

  if (user == null)return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2>not logged in page</h2>
      <Link href="/login">login</Link>
      <p> or </p>
      <Link href="/register">register</Link>

    </main>
  )

  if (user)return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2>logged in page</h2>
      <Feed/>
    </main>
  )
}

// "use client"
// import Image from 'next/image'
// import React, {useState, useContext, useEffect} from 'react'
// import { userContext } from './context/UserProvider'
// import Feed from '../components/Feed'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// export default function Home() {
//   let [islogin, setIsLogin] = useState(false)
//   let router = useRouter()
//   const user = useContext(userContext)
//   useEffect(()=>{
//     setIsLogin(false)
//     if (user != undefined) {
//       setIsLogin(true)
//     }
//   },[])
//   return !islogin?(
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h2>not logged in page</h2>
//       <Link href="/login">login</Link>
//       <p> or </p>
//       <Link href="/register">register</Link>

//     </main>
//   ):(
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h2>logged in page</h2>
//       <Feed/>
//     </main>
//   )
// }

