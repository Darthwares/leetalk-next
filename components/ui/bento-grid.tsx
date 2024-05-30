import { cn } from "@/lib/utils";
import Link from "next/link";
export const BentoGridItem = ({
  className,
  title,
  image,
  id,
}: {
  className?: string;
  title?: string | React.ReactNode;
  image?: string;
  id?: string;
}) => {
  return (
    <Link href={`/chat/${id}`}>
      <div
        className={cn(
          'row-span-1 cursor-pointer rounded-xl h-full group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border border-gray-300 gap-2 p-4 flex flex-col space-y-4',
          className
        )}
      >
        <img
          src={image}
          alt=""
          className="w-full aspect-square h-48 object-center rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"
        />
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 line-clamp-2">
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
};
