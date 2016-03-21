class AddCreatorToConversations < ActiveRecord::Migration
  def change
    add_column :conversations, :creator_id, :integer
  end
end
