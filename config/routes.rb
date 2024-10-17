Rails.application.routes.draw do
  resources :users, only: [:create] do
    resources :categories, only: [:index, :create]
    resources :tasks, only: [:index, :create, :show, :update, :destroy]
  end

  resources :task_shares, only: [:create]
  resources :comments, only: [:create]
  resources :attachments, only: [:create]
end
