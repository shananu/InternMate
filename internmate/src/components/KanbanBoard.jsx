import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialColumns = {
  todo: { title: "To Do", items: [] },
  inProgress: { title: "In Progress", items: [] },
  done: { title: "Done", items: [] },
};

const KanbanBoard = ({ selectedDate }) => {
  const dateKey = selectedDate.toISOString().split("T")[0];
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    const stored = localStorage.getItem(dateKey);
    if (stored) setColumns(JSON.parse(stored));
    else setColumns(initialColumns);
  }, [dateKey]);

  useEffect(() => {
    localStorage.setItem(dateKey, JSON.stringify(columns));
  }, [columns, dateKey]);

  const handleAddTask = (colId) => {
    const text = prompt("New task:");
    if (text)
      setColumns((prev) => {
        const newItems = [...prev[colId].items, { id: Date.now().toString(), text }];
        return { ...prev, [colId]: { ...prev[colId], items: newItems } };
      });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceCol = columns[result.source.droppableId];
    const destCol = columns[result.destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [removed] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, removed);

    setColumns({
      ...columns,
      [result.source.droppableId]: { ...sourceCol, items: sourceItems },
      [result.destination.droppableId]: { ...destCol, items: destItems },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {Object.entries(columns).map(([colId, colData], index) => (
          <div className={`kanban-column ${colId}`} key={colId}>
            <h3>{colData.title}</h3>
            <button onClick={() => handleAddTask(colId)}>+ Add</button>
            <Droppable droppableId={colId}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-dropzone">
                  {colData.items.map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="kanban-task"
                        >
                          {task.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
