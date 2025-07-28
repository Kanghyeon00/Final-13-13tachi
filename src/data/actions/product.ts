'use server';

import { ApiRes, ApiResPromise, LikeItemType } from '@/types';
import { revalidateTag } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

// 상품 좋아요 추가
export async function productAddLike(
  state: ApiRes<LikeItemType> | null,
  formData: FormData,
): ApiResPromise<LikeItemType> {
  const _id = formData.get('_id');
  const accessToken = formData.get('accessToken');

  let res: Response;
  let data: ApiRes<LikeItemType>;

  const body = {
    target_id: Number(formData.get('_id')),
  };

  try {
    res = await fetch(`${API_URL}/bookmarks/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  if (data.ok) {
    revalidateTag(`bookmarks`);
    revalidateTag(`/shopping/${_id}`);
    revalidateTag(`/shopping`);
  }

  return data;
}

// 상품 좋아요 삭제
export async function productDeleteLike(
  state: ApiRes<LikeItemType> | null,
  formData: FormData,
): ApiResPromise<LikeItemType> {
  const like_id = formData.get('like_id'); // 북마크의 id
  const _id = formData.get('_id'); // 상품의 id
  const accessToken = formData.get('accessToken');

  let res: Response;
  let data: ApiRes<LikeItemType>;

  const body = {
    target_id: Number(formData.get('_id')),
  };

  try {
    res = await fetch(`${API_URL}/bookmarks/${like_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  if (data.ok) {
    revalidateTag(`bookmarks`);
    revalidateTag(`/shopping/${_id}`);
    revalidateTag(`/shopping`);
  }

  return data;
}
