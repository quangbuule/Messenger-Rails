class CreateSubscriptions < ActiveRecord::Migration
  def change
    create_table :subscriptions do |t|
      t.references :user, index: true, foreign_key: true
      t.references :conversation, index: true, foreign_key: true
      t.boolean :read, default: false

      t.integer :last_message_id, foreign_key: true

      t.timestamps null: false
    end
  end
end
