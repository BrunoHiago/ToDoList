class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasks = current_user.tasks.includes(:categories) 
    render json: @tasks, include: :categories  
  end

  def create
    @task = current_user.tasks.build(task_params)

    if @task.save
      # Adiciona as categorias após a tarefa ser salva
      if params[:task][:category_ids].present?
        categories = Category.where(id: params[:task][:category_ids])
        @task.categories << categories
      end

      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @task = current_user.tasks.find(params[:id])
    @task.destroy
    render json: { message: 'Tarefa excluída com sucesso!' }
  end

  def update
    @task = current_user.tasks.find(params[:id])

    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :priority, :status, :due_date)
  end
end
