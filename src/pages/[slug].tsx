import Head from "next/head";
import type { GetStaticProps, NextPage } from "next/types";

import Image from "next/image";

import { api } from "~/utils/api";

import { PostView } from "~/components/postview";

const ProfileFeed = (props: {userId: string}) => {

  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId})

  if (isLoading) return <LoadingPage />;

  if(!data || data.length === 0) return <div>User has not posted.</div>;

  return (
  <div className="flex flex-col">
    {data.map(fullPost => (<PostView {...fullPost} key={fullPost.post.id}/>))}
  </div>)

}

const ProfilePage: NextPage<{username: string}> = ({username}) =>{

  const { data} = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>
  
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image 
            src={data.imageUrl} 
            alt={`${data.username}'s profile picture`}
            width={128}
            height={128}

            className="absolute bottom-0 left-0 ml-4 -mb-[64px] rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">@{data.username}</div>
        <div className="border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>

    </>
  );
};

import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";

import superjson from 'superjson';
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null  },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({username: slug});

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {paths: [], fallback: "blocking"} ;
}

export default ProfilePage;