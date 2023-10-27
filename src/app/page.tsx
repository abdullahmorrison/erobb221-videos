"use client"
import { useState, useEffect, use } from 'react'

interface Clip {
  _id: string
  url: string
  safetyStatus: "safe"|"unsafe"|"unknown"
  tags: string[]
}
export default function Home() {
  const [clip, setClip] = useState<Clip>()
  const [clipURL, setClipURL] = useState<string>('')
  const serverURL = 'https://chatbot-server.up.railway.app/'
  // const serverURL = 'http://localhost:3001/'
  const tags = [
    'Classic',
    'Deez Nuts',
    'Seal Moment',
    'LiMau5',
    'LTG',
    'StopBigJ',
    'Emmy',
    '15',
    'CLM',
    'Clucky',
    'Loud',
    'Jumpscare',
    'DemCowboys',
    'Lamonting',
    'Weirdo',
    'Old Erobb',
    'Lemon',
    'Regret',
    'Gameplay Highlight',
    'Personal Use',
    'WonkeyCry',
    'Grown Ass Man'
  ]

  useEffect(() => {
    async function getClip() { await fetchClip() }
    getClip()
  }, [])

  useEffect(() => {
    if(clip?.url.includes('streamable')){
      setClipURL(clip.url.replace('streamable.com', 'streamable.com/e/')+'?loop=0')
    }else if(clip?.url.includes('twitch')){
      const newURL = clip.url.replace('twitch.tv/', 'twitch.tv/embed?clip=')+'&parent=main--erobb221clips.netlify.app'
      setClipURL(newURL)
    }
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
  const updateTags = async (tags: string[]) => {
    if(!clip) return
    setClip({...clip, tags: tags})
    const res = await fetch(serverURL+'linkUpdateTags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: clip._id,
        tags: tags
      })
    })
    if(res.ok) console.log('success')
    else {
      alert('Failed to Update Tag')
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
          <iframe src={clipURL}  height="500" width="800" allowFullScreen/>
          <div className='flex flex-col items-center'>
            <h2 className='text-2xl text-blue-600 underline font-bold'>
              <a href={clip.url} target='__blank'>{clip.url}</a>
            </h2>
            <h2 className='mb-10'>Id: {clip._id}</h2>
            <div className='flex gap-10 mb-10'>
              <button onClick={()=>labelClip('safe')} className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded">
                Safe
              </button>
              <button onClick={()=>labelClip('unsafe')} className='bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded'>
                Unsafe
              </button>
              <button onClick={deleteClip} className='bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded'>
                Delete
              </button>
              <button onClick={fetchClip} className='bg-white text-black font-bold py-2 px-4 rounded'>
                Skip
              </button>
            </div>
            <h2 className='text-2xl font-bold mb-2'>Tags</h2>
            <div className='grid grid-cols-3 gap-3'>
              {tags.map((tag, i) => (
                <button key={i} className={`${clip.tags && clip.tags.includes(tag) ? 'bg-blue-600':'bg-gray-600'} hover:outline font-bold py-2 px-4 rounded`}
                  onClick={() => updateTags(clip.tags && clip.tags.includes(tag) ? clip.tags.filter(t => t !== tag) : [...(clip.tags || []), tag])}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </>
      }
    </main>
  )
}
