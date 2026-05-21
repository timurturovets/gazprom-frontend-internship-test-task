import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import PaginationControls from '../components/PaginationControls';
import { ApiError, fetchUsers } from '../api';
import { User } from '../types';

interface UserListPageProps {
  token: string;
  onTokenError?: (message: string) => void;
}

function splitName(fullName: string) {
  const [first, ...rest] = fullName.split(' ');
  return {
    firstName: first || fullName,
    lastName: rest.join(' ') || '-',
  };
}

function UserListPage({ token, onTokenError }: UserListPageProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!token.trim()) {
      setUsers([]);
      setError('Введите access token, чтобы загрузить пользователей.');
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError(null);
    
    fetchUsers(page, perPage, token)
      .then(({ items, totalPages: pages }) => {
        setUsers(items);
        setTotalPages(pages);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          if (onTokenError) {
            onTokenError('Невалидный токен. Проверьте значение и попробуйте снова.');
          }
          setUsers([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        setError(err.message);
        setUsers([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [page, perPage, token, onTokenError]);

  const content = useMemo(() => {
    if (loading) {
      return <div className="status-message">Загрузка списка пользователей...</div>;
    }
    if (error) {
      return <div className="status-message error">{error}</div>;
    }
    if (!users.length) {
      return <div className="status-message">Нет пользователей для отображения.</div>;
    }

    return (
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const fullName = splitName(user.name);
              return (
                <tr key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                  <td>{fullName.firstName}</td>
                  <td>{fullName.lastName}</td>
                  <td>{user.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }, [users, loading, error, navigate]);

  return (
    <section className="list-page">
      <div className="list-header">
        <Text weight="bold">Список пользователей</Text>
        <Text size="s">Нажмите на строку, чтобы открыть карточку пользователя.</Text>
      </div>
      {content}
      <PaginationControls page={page} totalPages={totalPages} perPage={perPage} onPageChange={setPage} onPerPageChange={(limit) => {
        setPerPage(limit);
        setPage(1);
      }} />
    </section>
  );
}

export default UserListPage;
