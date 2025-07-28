'use client';

import { productAddLike, productDeleteLike } from '@/data/actions/product';
import { ApiRes, LikeItemType, ProductType, User } from '@/types';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export default function ProductCardItem({
  item, // 현재 상품
  likeRes, // 찜한 목록 최신 상태
  accessToken, // user의 accessToken
  user,
}: {
  item: ProductType;
  likeRes: ApiRes<LikeItemType[] | null>;
  accessToken: string;
  user: User | null;
}) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false); // 현재 상품이 찜하기 상태인지 상태관리

  // 현재 상품이 찜하기 데이터에 있는지
  const likeItems =
    likeRes && likeRes.ok === 1 && Array.isArray(likeRes.item)
      ? likeRes.item.some(
          (like: LikeItemType) => like.product?._id === item._id,
        )
      : false;

  useEffect(() => {
    //찜하기 데이터에 있는지 여부를 isLike/setIsLike로 상태관리
    setIsLike(likeItems!);
  }, [likeItems]);

  const handleLikeChange = (newIsLike: boolean) => setIsLike(newIsLike); // 버튼 동작시 isLike 상태 업데이트 시켜줌

  const [, likeDeleteAction] = useActionState(productDeleteLike, null);
  const [, likeAddAction] = useActionState(productAddLike, null);

  const currentLike =
    likeRes && likeRes.ok === 1 && Array.isArray(likeRes.item)
      ? likeRes.item.find(
          (like: LikeItemType) => like.product?._id === item._id,
        )
      : null;

  return (
    <li>
      <Link href={`shopping/${item._id}`}>
        <div className="relative aspect-square">
          <Image
            src={`${API_URL}/${item.mainImages![0].path}`}
            alt={`${item.name} 이미지`}
            fill
            className="rounded-lg object-cover shadow-image"
          />
        </div>
        <div className="relative lg:mt-4 w-full">
          <div className="flex gap-2 w-full lg:pr-6">
            <h4 className="truncate lg:text-base">{item.name}</h4>
            <span className="text-gray lg:mt-[0.0625rem] lg:text-sm">
              {item.extra?.details}
            </span>
          </div>
          <strong className="inline-block text-orange lg:mt-1.5 lg:text-xl">
            {item.price?.toLocaleString()}원
          </strong>
          <form
            action={formData => {
              if (!user) {
                // user가 없으면 아무 동작도 하지 않음 (form submit 방지)
                return;
              }
              if (isLike) {
                likeDeleteAction(formData);
                handleLikeChange(false);
              } else {
                likeAddAction(formData);
                handleLikeChange(true);
              }
            }}
            className="absolute top-0.5 right-0 leading-1"
          >
            <input type="hidden" name="accessToken" value={accessToken ?? ''} />
            <input type="hidden" name="_id" value={item._id} />
            {currentLike && (
              <input type="hidden" name="like_id" value={currentLike._id} />
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                if (!user) {
                  e.preventDefault();
                  Swal.fire({
                    icon: 'warning',
                    text: '로그인 후 이용해주세요',
                    confirmButtonText: '확인',
                  }).then(result => {
                    if (result.isConfirmed) router.replace('/login');
                  });
                }
              }}
              className="cursor-pointer"
            >
              {isLike ? (
                <Heart strokeWidth={1} fill="#000" className="w-5 h-5" />
              ) : (
                <Heart strokeWidth={1} className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </Link>
    </li>
  );
}
