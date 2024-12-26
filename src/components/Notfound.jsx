import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <div class="flex flex-col h-screen justify-center items-center font-main">
      <div class="flex flex-col items-center">
        <h1 class="text-[120px] font-extrabold text-primary">404</h1>
        <p class="text-2xl font-medium text-zinc-500 mb-6">Page Not Found</p>
        <Link to="/"
          class="px-4 py-2 font-medium text-primary bg-main rounded-md hover:bg-[#9036c8]">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default Notfound
