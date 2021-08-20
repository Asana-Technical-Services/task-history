import type { NextPage } from "next";
import withAuth from "../../src/components/withAuth";
import { useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getTaskHistory } from "../../src/utils/getTaskHistory";
import TaskDisplay from "../../src/components/TaskDisplay";
import Timeline from "../../src/components/Timeline";
import styled from "styled-components";

const TaskHistoryWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: stretch;
`;

const Task: NextPage = () => {
  const router = useRouter();
  const { taskId } = router.query;
  const [stories, setStories] = useState([{}]);
  const [currentTaskData, setCurrentTaskData] = useState({});
  const [currentStoryGid, setCurrentStoryGid] = useState("");
  const [taskHistory, setTaskHistory] = useState(new Map());
  const [latestDate, setLatestDate] = useState("today");
  const [loading, setLoading] = useState(true);
  const [session, _] = useSession();

  useEffect(() => {
    if (typeof taskId !== "string" || taskId === "") {
      router.replace("/");
    } else {
      setLoading(true);
      if (typeof session?.accessToken === "string") {
        getTaskHistory(taskId, session.accessToken).then((newData) => {
          if (newData?.taskHistory && newData?.stories?.length) {
            setStories(newData.stories);
            setTaskHistory(newData.taskHistory);
            setCurrentTaskData(newData.taskHistory.get("today"));
            setLoading(false);
          } else {
            router.replace("/");
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
    router.push("/");
  };

  if (loading) return <div>loading...</div>;

  return (
    <TaskHistoryWrapper>
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
    </TaskHistoryWrapper>
  );
};

export default withAuth(Task);
