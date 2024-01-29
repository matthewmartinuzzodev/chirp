import Head from "next/head";
import { NextPage } from "next/types";


const SinglePostPage: NextPage = () =>{
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div> SinglePostPage
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;