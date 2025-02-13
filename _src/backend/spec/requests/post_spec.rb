require 'rails_helper'

RSpec.describe 'Posts', type: :request do

  let(:valid_params) do
    { post: { title: 'Title', content: 'Content', username: 'Username' } }
  end

  let(:valid_post) do
    FactoryBot.create(:post, title: 'Title', content: 'Content', username: 'Username')
  end

  describe 'GET /index' do
    it 'returns http sucess status' do
      get '/api/v1/posts'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST /create' do
    it 'returns http success status' do
      post '/api/v1/posts', params: valid_params
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /show' do
    it 'returns http success status' do
      post = valid_post
      get "/api/v1/posts/#{post.id}"
      expect(response).to have_http_status(:success)
    end
  end

  describe 'PUT /update' do
    it 'returns http success status' do
      post = valid_post
      put "/api/v1/posts/#{post.id}", params: valid_params
      expect(response).to have_http_status(:success)
    end
  end

  describe 'DELETE /destroy' do
    it 'returns http success status' do
      post = valid_post
      delete "/api/v1/posts/#{post.id}"
      expect(response).to have_http_status(:success)
    end
  end
end
