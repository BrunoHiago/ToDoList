class CategoriesController < ApplicationController
    before_action :set_category, only: %i[show update destroy]
  
    def index
      categories = Category.where(user_id: params[:user_id])
      render json: categories
    end
  
    def create
      category = Category.new(category_params)
      if category.save
        render json: category, status: :created
      else
        render json: category.errors, status: :unprocessable_entity
      end
    end
  
    private
  
    def set_category
      @category = Category.find(params[:id])
    end
  
    def category_params
      params.require(:category).permit(:name, :user_id)
    end
  end
  