import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./Login-SignUp/Login";
import LibraryDashboard from "./pages/Page-Admin/LibraryDashboard";


function App() {
  return (

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/admin/*" element={<LibraryDashboard/>} />
      </Routes>
   
  );
}

export default App;
