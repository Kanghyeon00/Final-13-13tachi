import Image from 'next/image';
import { MyPostType } from '@/types/recipe';
import Link from 'next/link';

export default function MyRecipeItem({ item }: { item: MyPostType }) {
  return (
    <div className="flex flex-col w-full">
      <Link href={`/recipe/${item._id}`} className="overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt={item.title}
          width={180}
          height={180}
          className="lg:w-[11.25rem] lg:h-[11.25rem] w-full aspect-square object-cover rounded-lg shadow-image transition-transform duration-300 hover:scale-110"
        />
      </Link>
      <div className="relative text-center mt-2.5">
        <Link href={`/recipe/${item._id}`}>
          <span className="w-full block truncate text-center">
            {item.title}
          </span>
        </Link>
      </div>
    </div>
  );
}
