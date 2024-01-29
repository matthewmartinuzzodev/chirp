import { SignInButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";


import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { NextPage } from "next/types";
import { useState } from "react";

import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";

import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const {user} = useUser();

  const [input, setInput] = useState<string>("");

  const ctx = api.useUtils();

  const { mutate, isLoading : isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage?.[0]){
        toast.error(errorMessage[0]);
      }
      else{
        toast.error("Failed to post! Pleas try again later.")
      }
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
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input});
            }
          }
        }}
        disabled={isPosting}

      />
      {input !== "" && !isPosting && (<button 
        onClick={() => mutate({ content: input})}
        disabled={isPosting}> Post 
      </button>)}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};


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
          <PageLayout>
            <div className="flex p-4 border-b border-slate-400">
              {!isSignedIn && (
                <div className="flex justify-center">
                  <SignInButton />
                </div>
              )}
              {isSignedIn && <CreatePostWizard />}
            </div>
          <Feed />
          </PageLayout>
  );
};

export default Home;