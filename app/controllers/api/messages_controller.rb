class Api::MessagesController < Api::BaseController
  def index
    conversation = Conversation.find(params[:conversation_id])
    subscription = conversation.subscriptions.where(user: current_user).first
    if not subscription.read
      subscription.update_columns(read: true)
    end

    render json: conversation.messages, root: false
  end

  def create
    @conversation = Conversation.find(params[:conversation_id])
    @message = Message.new(conversation: @conversation, user: current_user, content: params[:content])

    @conversation.subscriptions.each do |subscription|
      subscription.touch
      subscription.update_attributes(read: false) unless subscription.user == current_user
    end

    @conversation.last_message = @message

    @message.save!
    @conversation.save!

    render json: @message
  end
end
