class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.integer :priority, default: 0, null: false
      t.integer :status, default: 0, null: false
      t.date :due_date
      t.references :user, null: false, foreign_key: true
      t.references :category, foreign_key: true

      t.timestamps
    end
  end
end
