import axios from "axios";
const cloneDeep = require("lodash/cloneDeep");
//const taskId = "1200186779257471";

const STORY_TYPES = [
  "due_date_changed",
  "assigned",
  "added_to_project",
  "removed_from_project",
  "section_changed",
  "notes_changed",
  "name_changed",
  "enum_custom_field_changed",
  "number_custom_field_changed",
  "text_custom_field_changed",
  "multi_enum_custom_field_changed",
];

const revertTask = (i: number, stories: Array<any>, currentTask: any) => {
  let j = i;
  let newTask = cloneDeep(currentTask);
  if (stories[j].resource_subtype === "assigned") {
    console.log(j, i, stories[j]);
    j--;
    console.log(j, i, stories[j]);
    while (j >= 0 && stories[j].resource_subtype !== "assigned") {
      j--;
    }
    console.log(j, i);
    if (j < 0) {
      console.log("this one");
      newTask.assignee = { gid: "", name: "unassigned" };
      console.log(newTask.assignee);
    } else {
      console.log("second one");
      newTask.assignee = stories[j].assignee;
      console.log(newTask.assignee);
    }
  } else if (stories[j].resource_subtype === "due_date_changed") {
    newTask.due_on = stories[j].old_dates?.due_on;
    newTask.due_at = stories[j].old_dates?.due_at;
    newTask.start_on = stories[j].old_dates?.start_on;
    newTask.start_at = stories[j].old_dates?.start_at;
  } else if (stories[j].resource_subtype === "added_to_project") {
    console.log("added to a project");
    console.log("before");
    console.log(String(newTask.projects));
    console.log(String(newTask.memberships));
    for (let k = 0; k < newTask.projects.length; k++) {
      if (newTask.projects[k].gid === stories[j].project.gid) {
        newTask.projects.splice(k, 1);
        break;
      }
    }
    for (let k = 0; k < newTask.memberships.length; k++) {
      console.log(newTask.memberships[k].project?.gid);
      console.log(stories[j].project.gid);
      if (newTask.memberships[k].project?.gid === stories[j].project.gid) {
        newTask.memberships.splice(k, 1);
        break;
      }
    }
    console.log("after");
    console.log(String(newTask.projects));
    console.log(String(newTask.memberships));
  } else if (stories[j].resource_subtype === "removed_from_project") {
    newTask.projects.push(stories[j].project);
    let oldSection = {};
    // go backwards to see if we can find the last section change
    for (let k = j - 1; k > 0; k--) {
      if (
        stories[k].resource_subtype === "section_changed" &&
        stories[k].new_section.project.gid === stories[j].project
      ) {
        oldSection = {
          name: stories[k].new_section?.name,
          gid: stories[k].new_section?.gid,
        };
      }
    }
    newTask.memberships.push({
      project: stories[j].project,
      section: oldSection,
    });
  } else if (stories[j].resource_subtype === "notes_changed") {
    newTask.notes = stories[j].old_value;
  } else if (stories[j].resource_subtype === "name_changed") {
    newTask.name = stories[j].old_name;
  } else if (stories[j].resource_subtype === "section_changed") {
    for (let k = 0; k < newTask.memberships.length; k++) {
      if (
        newTask.memberships[k].project.gid ===
        stories[j].new_section.project.gid
      ) {
        newTask.memberships[k].section = {
          name: stories[j].old_section?.name || "Untitled section",
          gid: stories[j].old_section?.gid || "",
        };
        break;
      }
    }
  } else if (stories[j].resource_subtype === "enum_custom_field_changed") {
    for (let k = 0; k < newTask.custom_fields.length; k++) {
      if (newTask.custom_fields[k].gid === stories[j].custom_field.gid) {
        newTask.custom_fields[k].enum_value = stories[j].old_enum_value;
        newTask.custom_fields[k].display_value =
          stories[j].old_enum_value?.name;
        break;
      }
    }
  } else if (stories[j].resource_subtype === "number_custom_field_changed") {
    for (let k = 0; k < newTask.custom_fields.length; k++) {
      if (newTask.custom_fields[k].gid === stories[j].custom_field.gid) {
        newTask.custom_fields[k].number_value = stories[j].old_number_value;
        newTask.custom_fields[k].display_value = String(
          stories[j].old_number_value
        );
        break;
      }
    }
  } else if (stories[j].resource_subtype === "text_custom_field_changed") {
    for (let k = 0; k < newTask.custom_fields.length; k++) {
      if (newTask.custom_fields[k].gid === stories[j].custom_field.gid) {
        newTask.custom_fields[k].text_value = stories[j].old_text_value;
        newTask.custom_fields[k].display_value = stories[j].old_text_value;
        break;
      }
    }
  } else if (
    stories[j].resource_subtype === "multi_enum_custom_field_changed"
  ) {
    for (let k = 0; k < newTask.custom_fields.length; k++) {
      if (newTask.custom_fields[k].gid === stories[j].custom_field.gid) {
        newTask.custom_fields[k].multi_enum_values =
          stories[j].old_multi_enum_values;
        newTask.custom_fields[k].display_value = stories[
          j
        ].old_multi_enum_values
          ?.map((value: { name: string }) => value?.name)
          .join(", ");
        break;
      }
    }
  }

  return newTask;
};

const getOriginalTask = async (taskId: string) => {
  const asanaKey = "1/1200462692993359:578614c19fd01b97a078f4199aa2ce2e";
  const ASANA_URL = "https://app.asana.com/api/1.0/";

  const client = axios.create({
    baseURL: ASANA_URL,
    headers: { Authorization: `Bearer ${asanaKey}` },
  });

  try {
    const taskResponse = await client.get(
      `tasks/${taskId}?opt_fields=name,assignee.(name|gid),projects,custom_fields,memberships.(project|section).(name|gid),due_on,due_at,start_on,start_at,notes`
    );
    console.log(taskResponse.data.data);
    return taskResponse.data.data;
  } catch (err) {
    console.log(err);
    return {};
  }
};

const getAllStories = async (taskId: string): Promise<Array<any>> => {
  const ASANA_URL = "https://app.asana.com/api/1.0/";

  const client = axios.create({
    baseURL: ASANA_URL,
    headers: { Authorization: `Bearer ${asanaKey}` },
  });

  try {
    const storyResponse = await client.get(
      `tasks/${taskId}/stories?opt_fields=project.(name|color),custom_field,created_at,created_by.name,resource_subtype,type,text,new_value,old_value,new_text_value,old_text_value,old_number_value,new_number_value,old_name,new_name,old_enum_value,,new_enum_value,old_multi_enum_values,new_multi_enum_values,old_dates,new_dates,old_approval_status,new_approval_status,old_section.(name|project),new_section.(name|project),created_by,assignee.(gid|name)`
    );
    let stories = storyResponse.data.data;
    if (stories.filter) {
      return stories.filter((task: any) =>
        STORY_TYPES.includes(task.resource_subtype)
      );
    } else {
      return [{}];
    }
  } catch (err) {
    console.log(err);
    return [{}];
  }
};

const taskHistoryFromStories = async (
  originalTask: any,
  stories: Array<any>
): Promise<Array<any>> => {
  let dateChangedCount = 0;
  let assigneeChangedCount = 0;
  let currentTask = originalTask;
  let taskHistory = [];
  taskHistory.push(currentTask);
  // let dateShift = { firstDate: null, lastDate: null };
  // dateShift.lastDate = Date.parse(currentTask.due_on);
  // taskHistory.push(currentTask);
  // console.log("\n\n task currently has:");
  // console.log("due date: ", currentTask.due_on);
  // console.log("and assignee: ", currentTask.assignee.name, "\n\n");

  //iterate backwards through stories
  for (let i = stories.length - 1; i >= 0; i--) {
    if (stories[i].resource_subtype === "due_date_changed") {
      dateChangedCount++;
    } else if (stories[i].resource_subtype === "assigned") {
      assigneeChangedCount++;
    }
    currentTask = revertTask(i, stories, currentTask);
    taskHistory.push(currentTask);
  }

  return taskHistory;
};

export const getTaskHistory = async (id: string) => {
  const originalTask = await getOriginalTask(id);
  let stories = await getAllStories(id);

  const taskHistory = await taskHistoryFromStories(originalTask, stories);
  console.log(stories[0]);
  stories.reverse();
  console.log(stories[0]);

  return { stories, taskHistory };
};
