import QRCode from "qrcode"
import { useEffect, useState } from "react"

function GenerateQR({eventId}){

const [qr,setQr] = useState("")

useEffect(()=>{

QRCode.toDataURL(eventId)
.then((url)=>{
setQr(url)
})

},[eventId])

return(

<div>

<h2>Event QR Code</h2>

<img src={qr} alt="qr"/>

</div>

)

}

export default GenerateQR