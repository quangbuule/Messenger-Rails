class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.string :provider
      t.string :uid
      t.text :payload

      t.timestamps null: false
    end

    add_index(:accounts, [ :provider, :uid ], unique: true)
    add_reference :accounts, :user, index: true
  end
end
