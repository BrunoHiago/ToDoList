class Category < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :tasks  # Para a relação muitos para muitos


  validates :name, presence: true
end
