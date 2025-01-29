require 'rails_helper'

RSpec.describe Post, type: :model do
  
  it "タイトル、コンテンツ、ユーザー名があること" do
  post = Post.new(
    title: "title",
    content: "content",
    username: "username"
  )
  expect(post).to be_valid
  end

  it "タイトルがなければ無効であること" do
  post = Post.new(title: nil)
  post.valid?
  expect(post.errors[:title]).to include("can't be blank")
  end

  it "ユーザー名がなければ無効であること" do
  post = Post.new(username: nil)
  post.valid?
  expect(post.errors[:username]).to include("can't be blank")
  end

  it "重複したユーザー名があれば無効であること" do
  Post.create(
    title: "title",
    content: "content",
    username: "username"
  )
  post = Post.new(
    title: "title",
    content: "content",
    username: "username"
  )
  post.valid?
  expect(post.errors[:username]).to include("has already been taken")
  end
end
