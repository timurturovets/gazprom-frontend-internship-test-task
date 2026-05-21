import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { fetchUserById } from '../api';
import { User } from '../types';
import { useAppStore } from '../store';

function UserCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAppStore((state) => state.token);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (!token.trim()) {
      setError('Введите access token на главной странице.');
      return;
    }

    setLoading(true);
    setError(null);
    
    fetchUserById(id, token)
      .then((result) => {
        setUser(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  return (
    <section className="card-page">
      <div className="card-header">
        <Button label="Назад к списку" view="secondary" onClick={() => navigate('/')} />
      </div>
      <div className="card-body">
        <Text weight="bold" size="3xl">Пользователь</Text>
        {loading && <div className="status-message">Загрузка пользователя...</div>}
        {error && <div className="status-message error">{error}</div>}
        {user && (
          <div className="detail-card">
            <div className="detail-row">
              <span>Имя</span>
              <strong>{user.name}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="detail-row">
              <span>Пол</span>
              <strong>{user.gender}</strong>
            </div>
            <div className="detail-row">
              <span>Статус</span>
              <strong>{user.status}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserCardPage;
