class User < ApplicationRecord
    has_secure_password
    has_many :tasks
    has_many :categories
    has_many :task_shares
    has_many :shared_tasks, through: :task_shares, source: :task
  
    validates :email, presence: true, uniqueness: true
end