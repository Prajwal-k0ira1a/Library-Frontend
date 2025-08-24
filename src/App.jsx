import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./Login-SignUp/Login";
import UserDashboard from "./pages/Page-User/UserDashboard";
import LibraryDashboard from "./pages/Page-Admin/LibraryDashboard";


function App() {
  return (

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin/*" element={<LibraryDashboard/>} />
        <Route path="/user/*" element={<UserDashboard/>} />
      </Routes>
   
  );
}

export default App;
