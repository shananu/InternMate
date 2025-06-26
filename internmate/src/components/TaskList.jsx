import React, { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskList = ({ selectedDate, tasks, onAddTask, onUpdateTask, onDeleteTask, loading }) => {
  const columns = useMemo(() => ({
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  }), [tasks]);

  const columnLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  const handleAdd = async (column) => {
    const text = prompt("Enter task:");
    if (text) {
      await onAddTask(text, column); // Pass selected column
    }
  };

  const handleDelete = async (taskId) => {
    await onDeleteTask(taskId);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceTasks = columns[source.droppableId];
    const movedTask = sourceTasks[source.index];

    await onUpdateTask(movedTask._id, { status: destination.droppableId });
  };

  return (
    <div className="task-columns">
      {loading && <p style={{ padding: "1rem" }}>Loading tasks...</p>}
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnKey, items]) => (
          <Droppable key={columnKey} droppableId={columnKey}>
            {(provided) => (
              <div className="task-column">
                <h3>{columnLabels[columnKey]}</h3>
                <button className="add-btn" onClick={() => handleAdd(columnKey)}>+ Add Task</button>
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ padding: 0, listStyle: "none" }}
                >
                  {items.map((task, idx) => (
                    <Draggable key={task._id} draggableId={String(task._id)} index={idx}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task-item"
                          style={{
                            ...provided.draggableProps.style,
                            position: "relative",
                            background: "var(--card-bg, #fef6f0)",
                            padding: "0.75rem 1rem",
                            marginBottom: "0.75rem",
                            borderRadius: "12px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            color: "var(--text-color)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span>{task.title}</span>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(task._id)}
                            title="Delete Task"
                            style={{
                              background: "var(--accent-color, #ff7043)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: "22px",
                              height: "22px",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                              marginLeft: "0.5rem",
                              transform: "translateY(1px)"
                            }}
                          >
                            ×
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default TaskList;
