class Api::ConversationsController < Api::BaseController
  def index
    conversations = current_user.conversations.order("subscriptions.updated_at DESC")
    render json: conversations, root:false
  end

  def create
    conversation = Conversation.new(creator: current_user)
    conversation.subscriptions << Subscription.new(user: current_user, conversation: conversation)
    conversation.subscriptions << params[:receipent_ids].map do |i|
      Subscription.new(user: User.find(i), conversation: conversation)
    end

    conversation.save!
    render json: conversation, root:false
  end
end
