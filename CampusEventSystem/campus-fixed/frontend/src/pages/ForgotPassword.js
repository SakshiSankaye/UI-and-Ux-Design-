import { useState } from "react"
import axios from "axios"

function ForgotPassword(){

const [email,setEmail] = useState("")

const submit = async()=>{

await axios.post(
"http://localhost:5000/api/auth/forgot-password",
{email}
)

alert("Reset link sent to your email")
}

return(

<div className="auth-container">

<div className="auth-card">

<h2>Forgot Password</h2>

<input
placeholder="Enter Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<button onClick={submit}>
Send Reset Link
</button>

</div>

</div>

)

}

export default ForgotPassword