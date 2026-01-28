import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";

const RegisterPage = () => {

    const [name,setName]=useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ]=useState("");
    const  [confirmPassword, setConfirmPassword] = useState("");
    const[error,setError]=useState("");

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const submitHandler=async(e)=>{
        e.preventDefault();

        if(password!==confirmPassword){
            setError("password not match");
            return
        }

        try{
            const res = await axios.post("http://localhost:5000/api/auth/register",{
                name,
                email,
                password,
                role:"customer"
        });

        dispatch(setCredentials({...res.data}));
        navigate("/");
        }
        catch (err)
        {
            setError(err.response?.data?.message || "Registration Failed");
        }

    };
    
   
   return (
       <div className="flex justify-center items-center h-[80vh]">
           <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
               <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

               {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

               <form onSubmit={submitHandler}>
                   <div className="mb-4">
                       <label className="block text-gray-700 mb-1">Full Name</label>
                       <input type="text" className="w-full p-2 border rounded" required
                           value={name} onChange={(e) => setName(e.target.value)} />
                   </div>

                   <div className="mb-4">
                       <label className="block text-gray-700 mb-1">Email Address</label>
                       <input type="email" className="w-full p-2 border rounded" required
                           value={email} onChange={(e) => setEmail(e.target.value)} />
                   </div>

                   <div className="mb-4">
                       <label className="block text-gray-700 mb-1">Password</label>
                       <input type="password" className="w-full p-2 border rounded" required
                           value={password} onChange={(e) => setPassword(e.target.value)} />
                   </div>

                   <div className="mb-4">
                       <label className="block text-gray-700 mb-1">Confirm Password</label>
                       <input type="password" className="w-full p-2 border rounded" required
                           value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                   </div>

                   <button type="submit" className="w-full bg-yellow-400 text-gray-900 py-2 rounded hover:bg-yellow-300 font-bold">
                       Register
                   </button>
               </form>

               <p className="mt-4 text-center text-sm">
                   Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
               </p>
           </div>
       </div>
   );
   
  
};
export default RegisterPage;