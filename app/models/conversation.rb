class Conversation < ActiveRecord::Base
  belongs_to :creator, class_name: "User", foreign_key: :creator_id
  belongs_to :last_message, class_name: "Message", foreign_key: :last_message_id
  has_many :subscriptions
  has_many :messages
  attr_accessor :read
end
