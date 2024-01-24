import Head from "next/head";

import { SignInButton, useUser } from "@clerk/nextjs";

import { RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { NextPage } from "next/types";
import { useState } from "react";

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const {user} = useUser();

  const [input, setInput] = useState<string>("");

  const ctx = api.useUtils();

  const { mutate, isLoading : isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.getAll.invalidate();
    }
  });

  console.log(user)

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <img 
        src={user.imageUrl} 
        alt="Profile image" 
        className="rounded-full w-14 h-14" />
      <input 
        placeholder="Type some emojis!" 
        className="bg-transparent outline-none grow"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button onClick={() => mutate(
        { 
          content: input
        }
      )}> 
        Post
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props : PostWithUser) => {
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
          <span>{`@${author.username}`}</span>&nbsp;
          <span className="font-thin">
              {`· ${dayjs(post.createdAt).fromNow()}`}
          </span>
        </div>
        <span className="text-2xl">{post.content}</span> 
      </div>
    </div>
  )
}

const Feed = () => {
  const { data , isFetching : postsLoading } = api.posts.getAll.useQuery(undefined, {
    refetchOnWindowFocus : false
  });

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
    {data.map((fullPost) => (
      <PostView {...fullPost} key={fullPost.post.id}/> 
    ))}
  </div>
  );
};

const Home: NextPage = () =>{

  const { isLoaded : userLoaded, isSignedIn } = useUser();

  if(!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full h-full border-x border-slate-400 md:max-w-2xl ">
          <div className="flex p-4 border-b border-slate-400">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>

          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;