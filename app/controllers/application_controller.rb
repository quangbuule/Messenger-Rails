class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :require_login
  helper_method :current_user

  def require_login
    if session[:user_id].nil?
      redirect_to root_path
    end
  end

  def current_user
    User.find_by_id(session[:user_id])
  end
end
