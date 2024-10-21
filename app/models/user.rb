class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
    # has_secure_password
    has_many :tasks
    has_many :categories
    has_many :task_shares
    has_many :shared_tasks, through: :task_shares, source: :task
  
    # validates :email, presence: true, uniqueness: true
end