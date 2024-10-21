class Task < ApplicationRecord
  belongs_to :user
  has_many :task_shares
  has_many :comments
  has_many :attachments
  has_and_belongs_to_many :categories

  enum priority: { alta: 0, medium: 1, high: 2 }
  # enum status: { pending: 0, in_progress: 1, completed: 2 }

  validates :title, presence: true
end
