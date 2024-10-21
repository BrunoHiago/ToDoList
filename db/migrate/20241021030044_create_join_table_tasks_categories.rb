class CreateJoinTableTasksCategories < ActiveRecord::Migration[6.1]
  def change
    create_join_table :tasks, :categories do |t|
      # t.index [:task_id, :category_id]
      # t.index [:category_id, :task_id]
    end
  end
end
