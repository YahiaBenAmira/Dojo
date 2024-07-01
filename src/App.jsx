import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Auth from "./components/Auth";
import ChatRoom from "./components/ChatRoom";
import Room from "./components/Room";
import Home from "./components/Home";
import ChatBox from "./components/ChatBox";
import TeamChatRoom from "./components/TeamChatRoom";
import { SocketProvider } from "./contexts/SocketContext";
import { useAuthContext } from "./contexts/AuthContext";
import Tasks from "./components/Tasks";
import Profile from "./components/Profile";
function App() {
  const { authenticated } = useAuthContext();
  if (authenticated) {
    return <PrivateLayout />;
  }
  return <PublicLayout />;
}
const PrivateLayout = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/teamchatroom" element={<TeamChatRoom />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/Room" element={<Room />} />
        <Route path="/ChatRoom" element={<ChatRoom />}>
          <Route path=":roomId" element={<Outlet />}>
            <Route path="chatroom" element={<ChatBox />} />
            <Route path=":userId" element={<ChatBox />} />
          </Route>
        </Route>
      </Routes>
    </SocketProvider>
  );
};
const PublicLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
    </Routes>
  );
};
export default App;
