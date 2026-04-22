import {useEffect,useState} from "react"
import {io} from "socket.io-client"

const socket = io("http://localhost:5000")

function Notification(){

const [msg,setMsg] = useState("")

useEffect(()=>{

socket.on("notification",(data)=>{
setMsg(data)
})

},[])

return(

msg && (
<div>
🔔 {msg}
</div>
)

)

}

export default Notification