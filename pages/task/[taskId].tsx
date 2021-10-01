import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getTaskHistory } from "../../src/utils/getTaskHistory";
import TaskDisplay from "../../src/components/TaskDisplay";
import Timeline from "../../src/components/Timeline";
import styled from "styled-components";
import { Header } from "../../src/components/Header";

const TaskHistoryWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: stretch;
`;

const Task: NextPage & { auth: boolean } = () => {
  const router = useRouter();
  const { taskId } = router.query;
  const [stories, setStories] = useState([{}]);
  const [currentTaskData, setCurrentTaskData] = useState({});
  const [currentStoryGid, setCurrentStoryGid] = useState("");
  const [taskHistory, setTaskHistory] = useState(new Map());
  const [latestDate, setLatestDate] = useState("today");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof taskId !== "string" || taskId === "") {
      router.replace("/");
    } else {
      setLoading(true);
      if (typeof session?.access_token === "string") {
        getTaskHistory(taskId, session.access_token).then((newData) => {
          if (newData?.taskHistory && newData?.stories?.length) {
            setStories(newData.stories);
            setTaskHistory(newData.taskHistory);
            setCurrentTaskData(newData.taskHistory.get("today"));
            setLoading(false);
          } else {
            console.log("error!");
          }
        });
      } else setLoading(false);
    }
  }, []);

  const setCurrentStoryHandler = (storyGid: string, latestDate: string) => {
    let newLatestDate = new Date(latestDate);
    setCurrentStoryGid(storyGid);
    setCurrentTaskData(taskHistory.get(storyGid));
    setLatestDate(
      newLatestDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  };

  const backButtonHandler = () => {
    router.push("/home");
  };

  return (
    <div className="container flex-col">
      <Header />
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="flex-stretch">
          <TaskDisplay
            currentTaskData={currentTaskData}
            latestDate={latestDate}
            backFunction={backButtonHandler}
          />
          <Timeline
            currentStoryGid={currentStoryGid}
            selectNewStory={setCurrentStoryHandler}
            stories={stories}
          />
        </div>
      )}
    </div>
  );
};

Task.auth = true;
export default Task;
