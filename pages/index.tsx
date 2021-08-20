import type { NextPage } from "next";
import { useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import TaskForm from "../src/components/TaskForm";
import withAuth from "../src/components/withAuth";

const Home: NextPage = () => {
  const [session, sessionLoading] = useSession();
  const router = useRouter();

  const handleTaskIdChange = async (id: string) => {
    if (id === "") {
    } else {
      router.push(`/task/${id}`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Task History</title>
        <meta name="description" content="Asana Task History Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <TaskForm setTaskId={handleTaskIdChange} />
      </main>
    </div>
  );
};

export default withAuth(Home);
