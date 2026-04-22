import {useRef} from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

function Certificate(){

const ref = useRef()

const download = async ()=>{

const canvas = await html2canvas(ref.current)

const img = canvas.toDataURL("image/png")

const pdf = new jsPDF("landscape")

pdf.addImage(img,"PNG",10,10,280,180)

pdf.save("certificate.pdf")

}

return(

<div>

<div ref={ref} className="p-10 border text-center">

<h1 className="text-4xl font-bold">
Certificate of Participation
</h1>

<p>This is awarded to</p>

<h2 className="text-2xl font-bold">
Student Name
</h2>

<p>For participating in Hackathon</p>

</div>

<button onClick={download}>
Download Certificate
</button>

</div>

)

}

export default Certificate