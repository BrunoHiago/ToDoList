import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import NewTaskModal from "./NewTaskModal";
import { Button } from "reactstrap";
import NewCategoryModal from "./NewCategoryModal";
import {
  getAllCategories,
  getAllTasks,
  updateTaskStatus,
} from "../packs/services";

// Estado inicial para os dados
const initialData = {
  tasks: {},
  columns: {
    "column-1": { id: "column-1", title: "A fazer", taskIds: [] },
    "column-2": { id: "column-2", title: "Em andamento", taskIds: [] },
    "column-3": { id: "column-3", title: "Em Revisão", taskIds: [] },
    "column-4": { id: "column-4", title: "Concluído", taskIds: [] },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
  allCategories: [],
};

const CategoryColumn = () => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [newCategoryModal, setNewCategoryModal] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openNewCategoryModal = () => setNewCategoryModal(true);
  const closeNewCategoryModal = () => setNewCategoryModal(false);

  const userId = document
    .querySelector('meta[name="current-user-id"]')
    .getAttribute("content");

  // Função para carregar tasks e categorias
  useEffect(() => {
    const fetchData = async () => {
      const [categories, tasks] = await Promise.all([
        getAllCategories(userId),
        getAllTasks(userId),
      ]);

      const taskMap = tasks.reduce((acc, task) => {
        task.id = task.id.toString();
        acc[task.id] = task;
        return acc;
      }, {});

      console.log(taskMap);
      console.log(tasks);
      const updatedColumns = { ...data.columns };
      tasks.forEach((task) => {
        const columnId = `column-${task.status + 1}`; // Mapeia status para coluna
        updatedColumns[columnId]?.taskIds.push(task.id.toString());
      });

      console.log(updatedColumns);

      setData((prevData) => ({
        ...prevData,
        tasks: taskMap,
        columns: updatedColumns,
        allCategories: categories,
      }));
    };

    fetchData();
  }, [userId]);

  const handleSaveTask = (taskData) => {
    const newTaskId = `task-${Object.keys(data.tasks).length + 1}`;
    const newTask = { id: newTaskId, ...taskData };
    const newColumn = { ...data.columns["column-1"] };
    newColumn.taskIds.push(newTaskId);

    setData((prevData) => ({
      ...prevData,
      tasks: { ...prevData.tasks, [newTaskId]: newTask },
      columns: { ...prevData.columns, [newColumn.id]: newColumn },
    }));
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, result.draggableId);
      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData((prevData) => ({
        ...prevData,
        columns: { ...prevData.columns, [newColumn.id]: newColumn },
      }));
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, result.draggableId);
      const newStart = { ...startColumn, taskIds: startTaskIds };
      const newEnd = { ...endColumn, taskIds: endTaskIds };
      setData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newStart.id]: newStart,
          [newEnd.id]: newEnd,
        },
      }));

      try {
        await updateTaskStatus(
          result.draggableId,
          endColumn.id.split("-")[1] - 1,
          userId
        );
        console.log("Status atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar o status:", error);
      }
    }
  };

  const filteredTasks = (task) => {
    const matchesSearch = task?.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? task.categories.includes(categoryFilter)
      : true;
    return matchesSearch && matchesCategory;
  };

  return (
    <>
      <header style={styles.header}>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">Todas Categorias</option>
          {data.allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={styles.dateInput}
        />
        <Button color="primary" onClick={openNewCategoryModal}>
          Nova Categoria
        </Button>
        <button onClick={openModal} style={styles.createButton}>
          Nova Tarefa
        </button>
      </header>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        categories={data.allCategories}
      />

      <NewCategoryModal
        isOpen={newCategoryModal}
        onClose={closeNewCategoryModal}
        onSave={() => {
          getAllCategories(userId).then((categories) => {
            setData((prevData) => ({
              ...prevData,
              allCategories: categories,
            }));
          });
        }}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.container}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter(filteredTasks);

            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={styles.column}
                  >
                    <h3>{column.title}</h3>
                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={{
                              ...styles.task,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <p style={styles.taskContent}>{task.title}</p>
                            <div style={styles.categoryContainer}>
                              {task.categories.map((cat) => (
                                <span
                                  key={cat.id}
                                  style={{
                                    ...styles.category,
                                    backgroundColor: cat.color,
                                  }}
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

const styles = {
  header: {
    display: "flex",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: "8px",
  },
  select: {
    padding: "8px",
  },
  dateInput: {
    padding: "8px",
  },
  createButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    gap: "16px",
  },
  column: {
    backgroundColor: "#f4f4f4",
    border: "1px solid lightgray",
    borderRadius: "4px",
    width: "23%",
    padding: "8px",
  },
  task: {
    backgroundColor: "white",
    padding: "16px",
    margin: "8px 0",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  taskContent: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  categoryContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  category: {
    padding: "4px 8px",
    borderRadius: "16px",
    color: "white",
    fontSize: "12px",
  },
};

export default CategoryColumn;
