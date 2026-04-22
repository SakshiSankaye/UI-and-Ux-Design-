import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

function EventCalendar({events}){

return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-4">
Event Calendar
</h1>

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
style={{height:500}}
/>

</div>

)

}

export default EventCalendar