import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect } from "react"
import axios from "axios"

function ScanQR(){

useEffect(()=>{

const scanner = new Html5QrcodeScanner(
"reader",
{
fps:10,
qrbox:250
}
)

scanner.render(
async (decodedText)=>{

await axios.post("http://localhost:5000/api/attendance",{
eventId:decodedText
})

alert("Attendance marked")

},
(error)=>{}
)

},[])

return(

<div>

<h2>Scan Event QR</h2>

<div id="reader"></div>

</div>

)

}

export default ScanQR