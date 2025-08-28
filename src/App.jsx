import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./Login-SignUp/Register";
import Login from "./Login-SignUp/Login";
import UserDashboard from "./pages/Page-User/UserDashboard";
import LibraryDashboard from "./pages/Page-Admin/LibraryDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./protected/ProtectedRoute";
import Unauthorized from "./Login-SignUp/Unauthorized";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={ <Unauthorized/>}/>
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["librarian"]}><LibraryDashboard /></ProtectedRoute>} />
        <Route path="/user/*" element={<ProtectedRoute allowedRoles={["borrower"]}><UserDashboard /></ProtectedRoute>} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
