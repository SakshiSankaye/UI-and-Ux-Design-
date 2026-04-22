/* eslint-disable */
import { useEffect, useState } from "react"
import axios from "axios"
import MainNavbar from "../components/MainNavbar"
import { useNavigate } from "react-router-dom"
function Profile(){

const user = JSON.parse(localStorage.getItem("user"))
const navigate = useNavigate()

const [data,setData] = useState({})
const [edit,setEdit] = useState(false)
const [password,setPassword] = useState("")
const [image,setImage] = useState("")

useEffect(()=>{
loadProfile()
},[])

const loadProfile = async()=>{
const res = await axios.get(
`http://localhost:5000/api/users/profile/${user.id}`
)
setData(res.data)
}

// 🔥 IMAGE UPLOAD (BASE64 SIMPLE METHOD)
const handleImage = (e)=>{
const file = e.target.files[0]

const reader = new FileReader()
reader.onloadend = ()=>{
setImage(reader.result)
setData({...data, profilePic: reader.result})
}
reader.readAsDataURL(file)
}

// 🔐 UPDATE PROFILE
const updateProfile = async()=>{

await axios.put(
`http://localhost:5000/api/users/profile/${user.id}`,
data
)

alert("Profile Updated")
setEdit(false)

}

// 🔐 CHANGE PASSWORD
const changePassword = async()=>{

await axios.post(
`http://localhost:5000/api/auth/change-password/${user.id}`,
{password}
)

alert("Password Changed")

}

return(

<div className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen">

<MainNavbar/>

<div className="p-8 flex justify-center">

<div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">

{/* BACK BUTTON */}
<button
onClick={()=>navigate(-1)}
className="mb-4 text-sm text-gray-500 hover:text-black"
>
⬅ Back
</button>

{/* PROFILE HEADER */}
<div className="flex flex-col items-center">

<img
src={data.profilePic || "https://via.placeholder.com/100"}
className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow mb-3"
/>

{edit && (
<input type="file" onChange={handleImage} className="mb-3"/>
)}

<h2 className="text-xl font-bold">
{data.name}
</h2>

<p className="text-gray-500">{data.role}</p>

</div>

{/* FORM */}
<div className="mt-6 space-y-3">

<input
value={data.name || ""}
disabled={!edit}
onChange={(e)=>setData({...data,name:e.target.value})}
className="border p-2 w-full rounded"
/>

<input
value={data.email || ""}
disabled
className="border p-2 w-full rounded bg-gray-100"
/>

{/* BUTTONS */}
<div className="flex gap-4 mt-4">

{edit ? (
<button
onClick={updateProfile}
className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
>
Save
</button>
) : (
<button
onClick={()=>setEdit(true)}
className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
>
Edit Profile
</button>
)}

<button
onClick={()=>setEdit(false)}
className="flex-1 bg-gray-300 py-2 rounded"
>
Cancel
</button>

</div>

</div>

{/* PASSWORD SECTION */}
<div className="mt-8">

<h3 className="font-semibold mb-2">Change Password</h3>

<input
type="password"
placeholder="New Password"
onChange={(e)=>setPassword(e.target.value)}
className="border p-2 w-full rounded mb-2"
/>

<button
onClick={changePassword}
className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
>
Update Password
</button>

</div>

</div>

</div>

</div>

)

}

export default Profile