import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/protectRoute";
import Error from "./pages/Error";
import Navbar from "./components/common/Navbar";
import Loader from "./components/common/Loader";

const Groups = lazy(() => import("./pages/Groups"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/LoginSignup"));
const Chat = lazy(() => import("./pages/Chat"));
const Admin = lazy(() => import("./pages/Admin"));

let user = false;

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<ProtectRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route element={<ProtectRoute user={!user} redirect="/" />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/admin" element={<Admin />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
