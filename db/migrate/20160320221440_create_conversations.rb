class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations do |t|
      t.integer :last_message_id, foreign_key: true
      t.timestamps null: false
    end
  end
end
