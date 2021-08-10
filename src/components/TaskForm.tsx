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
    let input = taskIdInput;
    let finalInput = input;

    let splitInputArray = input.split("/");

    if (splitInputArray.length > 1) {
      finalInput = splitInputArray[splitInputArray.length - 2];
      console.log(splitInputArray);
      console.log(finalInput);
    }
    props.setTaskId(finalInput);
  };

  return (
    <TaskFormWrapper>
      <p>reference tasks: 1200538057511646 , 1200186779257471</p>
      <h2>Input your task Id, or a link to task:</h2>
      <input
        value={taskIdInput}
        onChange={(e) => setTaskIdInput(e.target.value)}
      ></input>
      <button onClick={handleSubmit}>Get task history</button>
    </TaskFormWrapper>
  );
}

export default TaskForm;
