import {BarChart,Bar,XAxis,YAxis,Tooltip} from "recharts"

const data = [
{name:"Users",value:120},
{name:"Events",value:20},
{name:"Registrations",value:340}
]

function AdminAnalytics(){

return(

<BarChart width={500} height={300} data={data}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="value" fill="#8884d8"/>

</BarChart>

)

}

export default AdminAnalytics