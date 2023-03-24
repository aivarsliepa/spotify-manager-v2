import Link from "next/link";
import { memo } from "react";

type LinkListItemProps = {
  href: string;
  img?: { src: string; alt: string };
  text: string;
};

const LinkListItem = ({ href, text, img }: LinkListItemProps) => {
  return (
    <Link href={href} className="flex h-14 items-center gap-4 py-1 px-4 hover:bg-slate-200">
      <div className="flex h-full gap-4">
        {img && <img src={img.src} alt={img.alt} className="h-full object-cover" width={48} height={48} />}
        <div className="self-center">{text}</div>
      </div>
    </Link>
  );
};

export default memo(LinkListItem);
