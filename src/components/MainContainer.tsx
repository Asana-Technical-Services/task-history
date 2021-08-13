import { useState, useEffect } from "react";
import "../App.css";
import styled from "styled-components";
import { getTaskHistory } from "../utils/getTaskHistory";
import TaskForm from "./TaskForm";
import TaskHistoryContainer from "./TaskHistoryContainer";

const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: relative;
  height: 85vh;
`;

interface MainContainerProps { 
  query:any
}

function MainContainer(props:MainContainerProps) {
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [taskHistory, setTaskHistory] = useState(new Map());
  const [stories, setStories] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [token,setToken] = useState("");
  const [code,setCode] = useState("");



  useEffect(()=>{
    if(props.query?.code){
      // ok
      setCode(props.query.code)
      let baseURL = process.env.API_URL
      //axios request
      let currentSite =  window.location.baseUrl

    }
  },[props])

  const handleTaskIdChange = async (id: string) => {
    if (id === "") {
      setCurrentTaskId("");
    } else {
      setLoading(true);
      let newData = await getTaskHistory(id);
      console.log(newData);

      if (newData?.taskHistory && newData?.stories?.length) {
        setStories(newData.stories);
        setTaskHistory(newData.taskHistory);
        setCurrentTaskId(id);
      } else {
        setCurrentTaskId("");
      }
      setLoading(false);
    }
  };

  return (
    <Container>
      {currentTaskId === "" ? (
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
      )}
    </Container>
  );
}

export default MainContainer;
