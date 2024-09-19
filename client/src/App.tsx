import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Loading from './components/Loading';

const HomePage = lazy(() => import('./pages/HomePage'));
const RoomPage = lazy(() => import('./pages/RoomPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const Error = lazy(() => import('./pages/Error'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='room/:roomCode' element={<RoomPage />} />
          <Route path='/info' element={<InfoPage />} />
          <Route path='full' element={<Error type='full' />} />
          <Route path='player-left' element={<Error type='player-left' />} />
          <Route path='*' element={<Error type='404' />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
