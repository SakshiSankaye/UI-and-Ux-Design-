import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

function Signup(){

const navigate = useNavigate()

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")   // ✅ FIX
const [showPassword,setShowPassword] = useState(false)
const [role,setRole] = useState("student")

// 🔥 PASSWORD STRENGTH
const getStrength = (password)=>{
if(password.length < 6) return "Weak"
if(password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong"
return "Medium"
}

const signup = async ()=>{

try{

const res = await axios.post(
"http://localhost:5000/api/auth/signup",
{ name, email, password, role }
)

alert(res.data.message)
navigate("/")

}catch(err){
alert(err.response?.data?.message || "Signup failed")
}

}

return(

<div className="auth-container">

<div className="auth-card">

<h2>Create Account</h2>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

{/* 🔥 PASSWORD FIELD */}
<div className="password-field">

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<span onClick={()=>setShowPassword(!showPassword)}>
{showPassword ? "🙈" : "👁️"}
</span>

</div>

{/* 🔥 STRENGTH */}
<p className={`strength ${getStrength(password).toLowerCase()}`}>
{getStrength(password)} Password
</p>

<select value={role} onChange={(e)=>setRole(e.target.value)}>
<option value="student">Student</option>
<option value="organizer">Organizer</option>
<option value="admin">Admin</option>
</select>

<button className="auth-btn" onClick={signup}>
Signup
</button>

<div className="auth-line">OR</div>

<span className="auth-link" onClick={()=>navigate("/")}>
Already have an account? Login
</span>

</div>

</div>

)

}

export default Signup