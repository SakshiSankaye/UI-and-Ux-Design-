import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/auth.css"

function ResetPassword(){

const {token} = useParams()
const navigate = useNavigate()

const [password,setPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")
const [loading,setLoading] = useState(false)

const submit = async(e)=>{

e.preventDefault()

// 🔒 validation
if(password.length < 6){
alert("Password must be at least 6 characters")
return
}

if(password !== confirmPassword){
alert("Passwords do not match")
return
}

try{

setLoading(true)

await axios.post(
`http://localhost:5000/api/auth/reset-password/${token}`,
{password}
)

alert("Password updated successfully 🎉")

// 🔥 redirect after 2 seconds
setTimeout(()=>{
navigate("/")
},2000)

}catch(err){

alert("Reset failed or link expired")

}

finally{
setLoading(false)
}

}

return(

<div className="auth-container">

<div className="auth-card">

<h2>Reset Password 🔐</h2>

<p className="text-sm mb-4 text-gray-500">
Enter your new password below
</p>

<form onSubmit={submit} className="space-y-4">

<input
type="password"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

<button className="auth-btn" disabled={loading}>
{loading ? "Updating..." : "Reset Password"}
</button>

</form>

</div>

</div>

)

}

export default ResetPassword