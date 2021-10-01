import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TaskForm from "../src/components/TaskForm";
import { Header } from "../src/components/Header";

const Home: NextPage & { auth: boolean } = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleTaskIdChange = async (id: string) => {
    if (id === "") {
    } else {
      router.push(`/task/${id}`);
    }
  };

  return (
    <div className="container flex-col">
      <Header />

      <main>
        <TaskForm setTaskId={handleTaskIdChange} />
      </main>
    </div>
  );
};

Home.auth = true;

export default Home;
