"use client"
import { useState, useEffect, use } from 'react'

interface Clip {
  _id: string
  url: string
  safetyStatus: "safe"|"unsafe"|"unknown"
}
export default function Home() {
  const [clip, setClip] = useState<Clip>()
  const [clipURL, setClipURL] = useState<string>('')
  const serverURL = 'https://chatbot-server.up.railway.app/'
  // const serverURL = 'http://localhost:3001/'
  
  useEffect(() => {
    async function getClip() { await fetchClip() }
    getClip()
  }, [])

  useEffect(() => {
    if(clip?.url.includes('streamable')){
      setClipURL(clip.url.replace('streamable.com', 'streamable.com/e/')+'?loop=0')
    }
    console.log(clip)
  }, [clip])
  
  const fetchClip= async () => {
    const res = await fetch(serverURL+'linkRandomUnlabelled')
    const newClip = await res.json()
    setClip(newClip.result.data)
  }
  const labelClip = async (label: "safe"|"unsafe") => {
    if(!clip) return
    const res = await fetch(serverURL+'linkUpdateSafetyStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: clip._id,
        safetyStatus: label
      })
    })
    if(res.ok) fetchClip()
    else {
      alert('Error')
      console.log(res)
    }
  }
  const deleteClip = async () => {
    if(!clip) return
    const res = await fetch(serverURL+'linkDelete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clip.url)
    })
    const data = await res.json()
    console.log(data)
    if(data.result.data === true) fetchClip()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-24">
      {clip && 
        <>
          <iframe src={clipURL}  height="378" width="620"/>
          <h2>{clip.url}</h2>
          <h2>id: {clip._id}</h2>
          <div className='flex gap-10'>
            <button onClick={()=>labelClip('safe')} className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded">
              Safe
            </button>
            <button onClick={()=>labelClip('unsafe')} className='bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded'>
              Unsafe
            </button>
            <button onClick={deleteClip} className='bg-gray-600 hover:bg-red-700 font-bold py-2 px-4 rounded'>
              Delete
            </button>
            <button onClick={fetchClip} className='bg-white hover:bg-white-700 text-black font-bold py-2 px-4 rounded'>
              Skip
            </button>
          </div>
        </>
      }
    </main>
  )
}
