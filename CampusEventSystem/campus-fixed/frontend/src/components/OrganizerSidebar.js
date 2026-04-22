import { useNavigate } from "react-router-dom"

function OrganizerSidebar(){

const navigate = useNavigate()

return(

<div className="w-64 bg-gray-900 text-white min-h-screen p-6">

<h2 className="text-xl font-bold mb-6">Organizer</h2>

<ul className="space-y-4">

<li onClick={()=>navigate("/organizer/dashboard")} className="cursor-pointer hover:text-blue-400">
Dashboard
</li>

<li onClick={()=>navigate("/organizer/Create-Event")} className="cursor-pointer hover:text-blue-400">
Create Events
</li>

<li onClick={()=>navigate("/organizer/manage-events")} className="cursor-pointer hover:text-blue-400">
Manage Events
</li>

<li onClick={()=>navigate("/organizer/participants")} className="cursor-pointer hover:text-blue-400">
Participants
</li>

<li onClick={()=>navigate("/organizer/attendance")} className="cursor-pointer hover:text-blue-400">
Attendance
</li>

<li onClick={()=>navigate("/organizer/feedback")} className="cursor-pointer hover:text-blue-400">
Feedback
</li>
<li onClick={()=>navigate("/profile")} className="cursor-pointer">
Profile
</li>
</ul>

</div>

)

}

export default OrganizerSidebar