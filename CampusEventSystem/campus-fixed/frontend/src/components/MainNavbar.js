import { useNavigate } from "react-router-dom"

function MainNavbar(){

const navigate = useNavigate()

const handleLogout = () => {
  localStorage.removeItem("user")
  navigate("/")
}

return(

<div className="bg-white shadow px-6 py-4 flex justify-between items-center">

<h1 className="text-xl font-bold">
Campus Event System
</h1>

<div className="flex gap-4">

<button
onClick={handleLogout}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Logout
</button>

</div>

</div>

)

}

export default MainNavbar