
import { RouterOutputs} from "~/utils/api";

import Image from "next/image";

import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime)

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props : PostWithUser) => {
  const {post, author} = props;
  return (
    <div key={post.id} className="flex gap-3 p-4 border-b border-slate-400">
      <Image 
        src={author.imageUrl}
        className="rounded-full w-14 h-14"
        alt={`${author.username}'s profile picture`}
        width={56}
        height={56}/>
      <div className="flex flex-col">
        <div className="flex font-bold text-slate-200">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>&nbsp;
          <Link href={`/post/${post.id}`}>
          <span className="font-thin">
              {`· ${dayjs(post.createdAt).fromNow()}`}
          </span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span> 
      </div>
    </div>
  )
}