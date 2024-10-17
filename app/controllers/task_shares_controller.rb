class TaskSharesController < ApplicationController
    def create
      task_share = TaskShare.new(task_share_params)
      if task_share.save
        render json: task_share, status: :created
      else
        render json: task_share.errors, status: :unprocessable_entity
      end
    end
  
    private
  
    def task_share_params
      params.require(:task_share).permit(:task_id, :user_id)
    end
  end
  