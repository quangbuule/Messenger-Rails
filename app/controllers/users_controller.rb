class UsersController < ApplicationController
  skip_before_action :require_login, only: [ :create, :log_in ]

  def create
    user_params = params.require(:user).permit(:username, :password, :password_confirmation)
    user = User.new(user_params)
    if user.save
      binding.pry
      flash[:success] = 'Signing up successfully.'
      redirect_to root_path

    else
      flash[:signing_up_errors] = user.errors.full_messages
      redirect_to root_path
    end
  end

  def log_in
    user_params = params.require(:user).permit(:username, :password)
    user = User.find_by_username(user_params[:username])


    if user.nil? or user.authenticate(user_params[:password]).nil?
      flash[:logging_in_errors] = ['Username or Password is not correct.']
      redirect_to root_path

    else
      flash[:success] = 'Logging in successfully.'
      session[:user_id] = user.id
      redirect_to messages_path
    end
  end
end
