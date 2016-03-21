class Api::UsersController < Api::BaseController
  def index
    offset = params[:skip].to_i
    limit = (params[:limit] || 20).to_i
    @users = User.where("username ilike ?", "%#{params[:q]}%").offset(offset).limit(limit + 1)
    @users.each do |user|
      user.is_friend = user.friend_with?(current_user)
    end
    response.headers['x-full'] = (User.offset(offset + 1).limit(limit + 1).count() <= limit).to_s
    render json: @users, root: false
  end

  def add_friend
    friend_params = params.require(:friend).permit(:id)
    friend = User.find(friend_params[:id])
    current_user.add_friend(friend) unless friend.nil?

    render json: friend_params
  end
end
