import Head from "next/head";
import type { GetStaticProps, NextPage } from "next/types";

import { api } from "~/utils/api";

const SinglePostPage: NextPage<{id: number}> = ({id}) =>{

  const { data} = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>
  
  return (
    <>
      <Head>
        <title>{data.post.content} - {data.author.username}</title>
      </Head>

      <PageLayout>
        <PostView {...data}></PostView>
      </PageLayout>

    </>
  );
};

import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/postview";

export const getStaticProps: GetStaticProps = async (context) => {

  const helpers = generateSSGHelper();

  const id = Number(context.params?.id);

  if (typeof id !== "number") throw new Error("No post with id");

  await helpers.posts.getById.prefetch({id})

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {paths: [], fallback: "blocking"} ;
}

export default SinglePostPage;