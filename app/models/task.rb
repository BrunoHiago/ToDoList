class Task < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true
  has_many :task_shares
  has_many :comments
  has_many :attachments

  enum priority: { low: 0, medium: 1, high: 2 }
  enum status: { pending: 0, in_progress: 1, completed: 2 }

  validates :title, presence: true
end
