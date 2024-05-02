import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='room/:roomCode' element={<RoomPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
