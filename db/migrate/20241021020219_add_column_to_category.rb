class AddColumnToCategory < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :color, :string
  end
end
