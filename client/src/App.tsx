import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const HomePage = lazy(() => import("./pages/HomePage"));
const RoomPage = lazy(() => import("./pages/RoomPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const FullRoom = lazy(() => import("./pages/FullRoom"));

const App = () => {
  return (
    <Router>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='room/:roomCode' element={<RoomPage />} />
          <Route path='full' element={<FullRoom />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
