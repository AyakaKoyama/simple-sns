class Post < ApplicationRecord
    valedates :title, presence: true
    validates :username, presence:true, uniqueness:true
end
