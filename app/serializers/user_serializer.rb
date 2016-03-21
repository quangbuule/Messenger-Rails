class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :is_friend
end
