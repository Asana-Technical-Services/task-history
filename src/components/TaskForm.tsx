import { useState } from "react";
import "../App.css";
import styled from "styled-components";

const TaskFormWrapper = styled.div`
  align-content: center;
  text-align: left;
  margin: 10%;
`;
interface TaskFormProps {
  setTaskId: (taskId: string) => void;
}

function TaskForm(props: TaskFormProps) {
  const [taskIdInput, setTaskIdInput] = useState("");


  const handleSubmit = () => {
    props.setTaskId(taskIdInput);
  };

  return (
    <TaskFormWrapper>
      <p>reference tasks: 1200538057511646 , 1200186779257471</p>
      <h2>Input your task Id:</h2>
      <input
        value={taskIdInput}
        onChange={(e) => setTaskIdInput(e.target.value)}
      ></input>
      <button onClick={handleSubmit}>Get task history</button>
    </TaskFormWrapper>
  );
}

export default TaskForm;
