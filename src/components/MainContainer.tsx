import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { getTaskHistory } from "../utils/getTaskHistory";
import TaskForm from "./TaskForm";
import TaskHistoryContainer from "./TaskHistoryContainer";
import { useSession } from "next-auth/client";
import { Login } from "./Login";

const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: relative;
  height: 100vh;
  width: 100vw;
`;

export function MainContainer() {
  const router = useRouter();
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [taskHistory, setTaskHistory] = useState(new Map());
  const [stories, setStories] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [session, sessionLoading] = useSession();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/signin");
    }
  }, [session]);

  const handleTaskIdChange = async (id: string) => {
    if (id === "") {
      setCurrentTaskId("");
    } else {
      setLoading(true);
      if (typeof session?.accessToken === "string") {
        let newData = await getTaskHistory(id, session.accessToken);
        if (newData?.taskHistory && newData?.stories?.length) {
          setStories(newData.stories);
          setTaskHistory(newData.taskHistory);
          setCurrentTaskId(id);
          setLoading(false);
        } else {
          setCurrentTaskId("");
          setLoading(false);
        }
      } else setLoading(false);
    }
  };

  return (
    <Container>
      <Login />
      {session &&
        (currentTaskId === "" ? (
          loading ? (
            <div>Loading...</div>
          ) : (
            <TaskForm setTaskId={handleTaskIdChange} />
          )
        ) : (
          <TaskHistoryContainer
            setCurrentTaskId={handleTaskIdChange}
            taskHistory={taskHistory}
            stories={stories}
          />
        ))}
    </Container>
  );
}

export default MainContainer;
