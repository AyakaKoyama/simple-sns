class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.string :title, limit:255, null:false
      t.text :content, limit:50000
      t.string :username, null:false
      
      t.timestamps
    end
  end
end
