class User < ActiveRecord::Base
  has_secure_password
  has_many :accounts
  has_many :subscriptions
  has_many :conversations, through: :subscriptions


  validates :username, uniqueness: true
  attr_accessor :is_friend

  def friends
    User.find($redis.smembers("messenger:users:#{id}:friends"))
  end

  def add_friend(friend)
    $redis.hset("messenger:users:#{id}:friends", friend.id, true)
    $redis.hset("messenger:users:#{friend.id}:friends", id, true)
  end

  def friend_with?(user)
    $redis.hget("messenger:users:#{id}:friends", user.id) == "true"
  end
end
