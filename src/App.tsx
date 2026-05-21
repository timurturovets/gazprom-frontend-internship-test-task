import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppStore } from './store';
import HomePage from './pages/HomePage';
import UserCardPage from './pages/UserCardPage';
import PostCardPage from './pages/PostCardPage';
import { Button } from '@consta/uikit/Button';

function App() {
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <h1>Посты и пользователи</h1>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users/:id" element={<UserCardPage />} />
          <Route path="/posts/:id" element={<PostCardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
