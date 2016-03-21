module Api
  class BaseController < ActionController::Base

    def current_user
      User.find(session[:user_id] || 0)
    end
  end
end
