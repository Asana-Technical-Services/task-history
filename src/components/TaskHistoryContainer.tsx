import { useState } from "react";
import "../App.css";
import TaskDisplay from "./TaskDisplay";
import Timeline from "./Timeline";
import styled from "styled-components";

const TaskHistoryWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: stretch;
`;

interface TaskHistoryProps {
  setCurrentTaskId: (id: string) => void;
  stories: Array<any>;
  taskHistory: Array<any>;
}

function TaskHistoryContainer(props: TaskHistoryProps) {
  const [currentTaskData, setCurrentTaskData] = useState(props.taskHistory[0]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [latestDate, setLatestDate] = useState("today");

  const currentStoryIndexHandler = (newDex: number) => {
    let newLatestDate = new Date(props.stories[newDex].created_at);
    setCurrentStoryIndex(newDex);
    setCurrentTaskData(props.taskHistory[newDex]);
    setLatestDate(
      newLatestDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  };
  const backButtonHandler = () => {
    props.setCurrentTaskId("");
  };

  return (
    <TaskHistoryWrapper>
      <TaskDisplay
        currentTaskData={currentTaskData}
        latestDate={latestDate}
        backFunction={backButtonHandler}
      />
      <Timeline
        selectedIndex={currentStoryIndex}
        selectNewIndex={currentStoryIndexHandler}
        stories={props.stories}
      />
    </TaskHistoryWrapper>
  );
}

export default TaskHistoryContainer;
