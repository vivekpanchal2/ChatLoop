import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/protectRoute";
import Error from "./pages/Error";
import Navbar from "./components/common/Navbar";
import Loader from "./components/common/Loader";
import { useSelector } from "react-redux";

const Groups = lazy(() => import("./pages/Groups"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/LoginSignup"));
const Chat = lazy(() => import("./pages/Chat"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessagesManagement = lazy(() =>
  import("./pages/admin/MessageManagement")
);

function App() {
  let { user } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
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

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />

          <Route path="/loader" element={<Loader />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
