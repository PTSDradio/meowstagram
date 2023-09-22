"use client"
import Image from 'next/image'
import React, {useContext} from 'react'
import { userContext } from './context/UserProvider'
import Feed from '../components/Feed'
import Link from 'next/link'

export default function Home() {
  const user = useContext(userContext)
  // let user = false

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
