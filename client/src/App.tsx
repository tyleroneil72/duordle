import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import Loading from "./components/Loading";

const HomePage = lazy(() => import("./pages/HomePage"));
const RoomPage = lazy(() => import("./pages/RoomPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const Error = lazy(() => import("./pages/Error"));

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='room/:roomCode' element={<RoomPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='full' element={<Error type='full' />} />
          <Route path='player-left' element={<Error type='player-left' />} />
          <Route path='*' element={<Error type='404' />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
