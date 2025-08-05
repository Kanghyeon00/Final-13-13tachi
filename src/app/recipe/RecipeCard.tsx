'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { Post } from '@/types/recipe';
import useBookmarkStore from '@/zustand/useBookmarkStore';

interface RecipeCardProps {
  posts: Post[];
  toggleBookmark: (postId: number) => void;
  maxCount?: number;
  sortBy?: 'likes' | 'views' | 'bookmarks' | 'recent';
}

export default function RecipeCard({
  posts,
  toggleBookmark,
  maxCount = 4,
  sortBy = 'likes',
}: RecipeCardProps) {
  const { likeMap } = useBookmarkStore();

  // 인기 레시피 필터링 및 정렬 로직 (캐러셀과 동일)
  const sortedRecipes = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const validRecipes = posts.filter(recipe => recipe._id);

    const sorted = validRecipes.sort((a, b) => {
      switch (sortBy) {
        case 'bookmarks': {
          const aLiked = likeMap.has(a._id) ? 1 : 0;
          const bLiked = likeMap.has(b._id) ? 1 : 0;
          if (aLiked !== bLiked) return bLiked - aLiked;
          break;
        }
        case 'recent': {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        }
        default:
          return 0;
      }
      return 0;
    });

    return sorted.slice(0, maxCount);
  }, [posts, maxCount, sortBy, likeMap]);

  // 레시피가 없을 때
  if (!sortedRecipes || sortedRecipes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">레시피가 없습니다.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[25px]">
      {sortedRecipes.map(item => (
        <Link
          key={item._id}
          href={`/recipe/${item._id}`}
          className="w-full block"
        >
          <figure className="w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 select-none">
                  이미지 없음
                </div>
              )}
            </div>
            <figcaption className="mt-3">
              <div className="relative flex">
                <span className="w-full pr-5.5 text-lg font-semibold truncate md:text-xl md:pr-6">
                  {item.title}
                </span>
                <Bookmark
                  strokeWidth={1}
                  className={`absolute right-0 md:top-1 cursor-pointer w-[1.25rem] top-0 md:w-[1.5rem]
                   ${likeMap.has(item._id) ? 'fill-black text-black' : 'text-black'} focus:outline-none`}
                  onClick={e => {
                    e.preventDefault();
                    toggleBookmark(item._id);
                  }}
                  aria-label={
                    likeMap.has(item._id) ? '북마크 해제' : '북마크 추가'
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleBookmark(item._id);
                    }
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange text-xs md:text-sm truncate">
                  {item.tag
                    ? item.tag
                        .split(',')
                        .map(tag => tag.trim())
                        .join(' | ')
                    : '재료 없음'}
                </span>
                <span className="text-gray text-xs md:text-sm truncate">
                  {item.user.name}
                </span>
              </div>
            </figcaption>
          </figure>
        </Link>
      ))}
    </div>
  );
}
