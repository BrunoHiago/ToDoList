class HomeController < ApplicationController
  before_action :authenticate_user!  # Garante que o usuário esteja logado

  def index
    @tasks = current_user.tasks  # Busca todas as tasks do usuário logado
  end
end
