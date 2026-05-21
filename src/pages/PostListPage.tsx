import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@consta/uikit/Text';
import PaginationControls from '../components/PaginationControls';
import { ApiError, fetchPosts } from '../api';
import { Post } from '../types';

interface PostListPageProps {
  token: string;
  onTokenError?: (message: string) => void;
}

function PostListPage({ token, onTokenError }: PostListPageProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!token.trim()) {
      setPosts([]);
      setError('Введите access token, чтобы загрузить посты.');
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError(null);

    fetchPosts(page, perPage, token)
      .then(({ items, totalPages: pages }) => {
        setPosts(items);
        setTotalPages(pages);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          if (onTokenError) {
            onTokenError('Невалидный токен. Проверьте значение и попробуйте снова.');
          }
          setPosts([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        
        setError(err.message);
        setPosts([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [page, perPage, token, onTokenError]);

  const content = useMemo(() => {
    if (loading) {
      return <div className="status-message">Загрузка списка постов...</div>;
    }
    if (error) {
      return <div className="status-message error">{error}</div>;
    }
    if (!posts.length) {
      return <div className="status-message">Нет постов для отображения.</div>;
    }

    return (
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Заголовок</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                <td>{post.id}</td>
                <td>{post.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [posts, loading, error, navigate]);

  return (
    <section className="list-page">
      <div className="list-header">
        <Text weight="bold">Список постов</Text>
      </div>
      {content}
      <PaginationControls page={page} totalPages={totalPages} perPage={perPage} onPageChange={setPage} onPerPageChange={(limit) => {
        setPerPage(limit);
        setPage(1);
      }} />
    </section>
  );
}

export default PostListPage;
