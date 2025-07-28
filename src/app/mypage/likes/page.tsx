// 찜목록
import LikeList from '@/app/mypage/likes/LikeList';

export default async function Likes() {
  return (
    <main className="flex flex-col gap-4 lg:w-[49.875rem] md:w-[31.75rem] w-80 h-full">
      <div className="flex flex-col gap-2">
        <h3 className="w-full text-xl font-semibold">내가 찜한 상품</h3>
        <hr className="text-light-gray w-full" />
      </div>
      <LikeList />
    </main>
  );
}
