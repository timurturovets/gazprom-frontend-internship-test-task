import { useMemo, useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { Card } from '@consta/uikit/Card';
import { TextField } from '@consta/uikit/TextField';
import { Text } from '@consta/uikit/Text';
import { useAppStore } from '../store';
import PostListPage from './PostListPage';
import UserListPage from './UserListPage';

function HomePage() {
  const token = useAppStore((state) => state.token);
  const viewMode = useAppStore((state) => state.viewMode);
  const setToken = useAppStore((state) => state.setToken);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const activeList = useMemo(() => {
    if (tokenError) {
      return null;
    }
    return viewMode === 'users' ? (
      <UserListPage token={token} onTokenError={setTokenError} />
    ) : (
      <PostListPage token={token} onTokenError={setTokenError} />
    );
  }, [token, viewMode, tokenError]);

  return (
    <div className="home-page">
      <Card className="token-card" shadow={false} style={{ width: '100%' }}>
        <div className="token-card-header">
          <Text size="xl" weight="bold">
            Access token
          </Text>
          <Text size="s" view="secondary" className="token-card-description">
            Вставьте Gorest-токен. 
          </Text>
        </div>
        <TextField
          label="Токен доступа"
          labelPosition="top"
          value={token}
          onChange={(value) => {
            setToken(value ?? '');
            setTokenError(null);
          }}
          placeholder="Введите access token"
          status={tokenError ? 'alert' : token.trim() ? 'success' : 'alert'}
          caption={tokenError ?? (token.trim() ? 'Токен введён' : 'Токен не может быть пустым')}
          className="token-input"
          style={{ width: '100%' }}
        />
      </Card>

      <section className="list-shell">
        <div className="list-header">
          <div className="list-heading">
            <Text size="xl" weight="bold">
              {viewMode === 'users' ? 'Пользователи' : 'Посты'}
            </Text>
            <div className="mode-switch">
              <Button
                label="Пользователи"
                view={viewMode === 'users' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('users')}
              />
              <Button
                label="Посты"
                view={viewMode === 'posts' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('posts')}
              />
            </div>
          </div>
        </div>
        {activeList}
      </section>
    </div>
  );
}

export default HomePage;
