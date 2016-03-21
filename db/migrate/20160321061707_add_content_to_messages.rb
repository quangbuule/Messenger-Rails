class AddContentToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :content, :text, default: ""
  end
end
