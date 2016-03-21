class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :last_message
  has_one :last_message, key: :last_message_id
  has_many :subscriptions
end
