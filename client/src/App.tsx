import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RoomPage from "./components/RoomPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/room/:roomCode' element={<RoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
