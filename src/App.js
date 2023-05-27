import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import ChatPage from "./pages/chatPage/ChatPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Loader from "./components/loader/Loader";

function App() {
  const { currentUser, loading } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const LoggedInProtectionRoute = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/chats" />;
    }
    return children;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <LoggedInProtectionRoute>
              <Homepage />
            </LoggedInProtectionRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
