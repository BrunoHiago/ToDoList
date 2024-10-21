Rails.application.routes.draw do
  get 'home/index'
  root to: 'home#index'
  devise_for :users
  resources :users, only: [:index, :create] do
    resources :categories, only: [:index, :create], defaults: { format: :json }
    resources :tasks, only: [:index, :create, :show, :update, :destroy]
  end

  resources :task_shares, only: [:create, :destroy]
  resources :comments, only: [:create]
end
