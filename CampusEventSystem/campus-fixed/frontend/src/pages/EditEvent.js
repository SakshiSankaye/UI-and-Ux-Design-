import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"

import AdminSidebar from "../components/AdminSidebar"
import AdminNavbar from "../components/AdminNavbar"

import { getEvents, updateEvent } from "../services/adminApi"

function EditEvent(){

const { id } = useParams()
const navigate = useNavigate()

const [title, setTitle] = useState("")
const [date, setDate] = useState("")
const [location, setLocation] = useState("")
const [loading, setLoading] = useState(true)

// ✅ FIXED: wrapped in useCallback
const loadEvent = useCallback(async () => {

  const events = await getEvents()

  const event = events.find(e => e._id === id)

  if(event){
    setTitle(event.title)
    setDate(event.date)
    setLocation(event.location)
  }

  setLoading(false)

}, [id])

// ✅ FIXED: dependency added
useEffect(()=>{
  loadEvent()
}, [loadEvent])

const submit = async(e)=>{
  e.preventDefault()

  await updateEvent(id,{
    title,
    date,
    location
  })

  navigate("/admin/events")
}

// ✅ Loading UI
if(loading){
  return <h2 className="text-center mt-10">Loading...</h2>
}

return(

<div className="flex">

<AdminSidebar/>

<div className="flex-1">

<AdminNavbar/>

<div className="p-8">

<h2 className="text-xl font-bold mb-4">
Edit Event
</h2>

<form onSubmit={submit} className="space-y-4">

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border p-2 w-full"
placeholder="Event Title"
/>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border p-2 w-full"
/>

<input
value={location}
onChange={(e)=>setLocation(e.target.value)}
className="border p-2 w-full"
placeholder="Location"
/>

<button className="bg-green-500 text-white px-6 py-2 rounded">
Update Event
</button>

</form>

</div>

</div>

</div>

)

}

export default EditEvent