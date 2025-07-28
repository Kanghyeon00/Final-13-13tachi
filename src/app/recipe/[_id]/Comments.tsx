'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Comment from './Comment';
import useUserStore from '@/zustand/useStore';
import Swal from 'sweetalert2';

interface CommentType {
  _id: number;
  content: string;
  name: string;
  user: { _id: number; name: string };
  createdAt: string;
  updatedAt?: string;
}

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const { user } = useUserStore();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/replies?limit=10&page=1&sort={"_id":1}`,
        {
          headers: { 'client-id': process.env.NEXT_PUBLIC_CLIENT_ID || '' },
          cache: 'no-store',
        },
      );
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data.item || []);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: '댓글을 불러오는 데 실패했습니다.',
        confirmButtonText: '확인',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      Swal.fire({
        icon: 'warning',
        text: '댓글 내용을 입력해주세요.',
        confirmButtonText: '확인',
      });
      return;
    }

    if (!user) {
      Swal.fire({
        icon: 'warning',
        text: '로그인이 필요합니다.',
        confirmButtonText: '확인',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'client-id': process.env.NEXT_PUBLIC_CLIENT_ID || '',
          },
          body: JSON.stringify({
            content,
            name: user.name,
          }),
        },
      );
      const data = await res.json();
      if (res.status === 201 && data.ok === 1) {
        setContent('');
        await fetchComments();
        Swal.fire({
          icon: 'success',
          text: '댓글이 등록되었습니다.',
          confirmButtonText: '확인',
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: data.message || '댓글 등록에 실패했습니다.',
          confirmButtonText: '확인',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        text: '네트워크 오류가 발생했습니다.',
        confirmButtonText: '확인',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (_id: number) => {
    setComments(prev => prev.filter(comment => comment._id !== _id));
  };

  const handleUpdate = (_id: number, newContent: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id === _id ? { ...comment, content: newContent } : comment,
      ),
    );
  };

  return (
    <div className="p-15">
      <div className="flex items-center border-b-2 border-[#DEDEDE]">
        <h3 className="text-xl font-semibold mb-2">댓글</h3>
        <span className="text-xl font-semibold text-[#67913C] ml-2 mb-2">
          {comments.length}
        </span>
      </div>

      {loading && <p>댓글 불러오는 중...</p>}

      {comments.map(comment => (
        <Comment
          key={comment._id}
          postId={postId}
          comment={comment}
          currentUserId={user?._id || null}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}

      <form onSubmit={handleSubmit} className="mt-9 flex items-center">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          className="w-[48.75rem] h-[2.5rem] border border-light-gray rounded-lg mr-5 px-5 text-sm"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
        />
        <Button size="md" type="submit" disabled={loading}>
          {loading ? '등록 중...' : '등록'}
        </Button>
      </form>
    </div>
  );
}
