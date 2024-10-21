
export const getAllCategories = async (userId) => {
    try {
        const response = await fetch(`users/${userId}/categories`);
        const data = await response.json();
        
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

export const getAllTasks = async (userId) => {
    try {
        const response = await fetch(`users/${userId}/tasks`);
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

export const createTask = async (taskData, userId) => {
    try {
        const response = await fetch(`users/${userId}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
            },
            body: JSON.stringify({
                task: {
                    title: taskData.title,
                    description: taskData.description,
                    priority: Number(taskData.priority),
                    category_ids: taskData.categoryId,
                    due_date: taskData.dueDate,
                },
            }),
        });
        return response;
    }
    catch (error) {
        console.error(error);
    }
}

export const updateTaskStatus = async (taskId, status, userId) => {
    const response = await fetch(`users/${userId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
     },
      body: JSON.stringify({ status }),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao atualizar o status da tarefa");
    }
  
    return response.json();
  };
  