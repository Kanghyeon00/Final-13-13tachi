import Image from 'next/image';

// 임시 이미지 불러오기
import { LikePostItemType } from '@/types/post';
import { Bookmark } from 'lucide-react';
import useUserStore from '@/zustand/useStore';
import Link from 'next/link';

interface LikePostActionType {
  deleteAction: (FormData: FormData) => void;
}

export default function LikeRecipeItem({
  item,
  action,
}: {
  item: LikePostItemType;
  action: LikePostActionType;
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useUserStore();

  return (
    <div className="flex flex-col">
      <Link href={`/recipe/${item._id}`}>
        <Image
          src={`${API_URL}/${item.image}`}
          alt={item.title}
          width={180}
          height={180}
          className="lg:w-[11.25rem] lg:h-[11.25rem] md:w-36 md:h-36 w-34 h-34 object-cover rounded-lg shadow-image"
        />
      </Link>
      <div className="relative text-center mt-2.5">
        <div className="absolute right-0">
          <form action={action.deleteAction}>
            <input
              type="hidden"
              name="accessToken"
              value={user?.token?.accessToken ?? ''}
            />
            <input type="hidden" name="_id" value={item._id} />
            <button className="hover:cursor-pointer">
              <Bookmark fill="black" />
            </button>
          </form>
        </div>
        <Link href={`/recipe/${item._id}`}>{item.title}</Link>
      </div>
    </div>
  );
}
