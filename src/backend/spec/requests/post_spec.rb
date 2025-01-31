require 'rails_helper'

RSpec.describe "Posts", type: :request do

  describe "GET /index" do
    it "returns http sucess status" do
     get "/api/v1/posts"  
     expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    it "returns http success status" do
      post "/api/v1/posts", params: { post: { title: "Title", content: "Content", username: "Username" } }
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success status" do
      post = FactoryBot.create(:post, title: "Title", content: "Content", username: "Username") 
      expect(post).to be_valid
      get "/api/v1/posts/#{post.id}"
      expect(response).to have_http_status(:success)
    end
  end
end
