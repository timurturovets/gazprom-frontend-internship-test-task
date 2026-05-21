import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { fetchPostById, fetchPostComments } from '../api';
import { CommentItem, Post } from '../types';
import { useAppStore } from '../store';

function PostCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAppStore((state) => state.token);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (!token.trim()) {
      setError('Введите access token на главной странице.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    Promise.all([fetchPostById(id, token), fetchPostComments(id, token)])
      .then(([postResult, commentResult]) => {
        setPost(postResult);
        setComments(commentResult);
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
        <Text weight="bold" size="3xl">Пост</Text>
        {loading && <div className="status-message">Загрузка поста...</div>}
        {error && <div className="status-message error">{error}</div>}
        {post && (
          <div className="detail-card">
            <div className="detail-row">
              <span>ID</span>
              <strong>{post.id}</strong>
            </div>
            <div className="detail-row">
              <span>Заголовок</span>
              <strong>{post.title}</strong>
            </div>
            <div className="detail-row body-row">
              <span>Текст</span>
              <p>{post.body}</p>
            </div>
          </div>
        )}
        {comments.length > 0 && (
          <div className="comments-section">
            <Text weight="bold">Комментарии ({comments.length})</Text>
            <div className="comments-list">
              {comments.map((comment) => (
                <article key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <strong>{comment.name}</strong>
                    <span>{comment.email}</span>
                  </div>
                  <p>{comment.body}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PostCardPage;
