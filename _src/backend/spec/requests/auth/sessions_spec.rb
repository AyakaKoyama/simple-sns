require 'rails_helper'

RSpec.describe "Auth::Sessions", type: :request do
  describe "GET /auth/sessions" do
    context "ユーザーがログインしている場合" do
      let(:user) { create(:user, :confirmed) }
      let(:auth_headers) { user.create_new_auth_token }

      it "ユーザー情報が返却されること" do
        get '/auth/sessions', headers: auth_headers 
        # レスポンスボディを確認
        body = JSON.parse(response.body)
        puts "レスポンスボディ: #{body.inspect}"
        expect(response).to have_http_status(:ok)
        expect(body['is_login']).to eq(true)
        expect(body['data']['email']).to eq(user.email)
      end
    end

    context "ユーザーがログインしていない場合" do
      it "ログインしていないメッセージが返却されること" do
        get '/auth/sessions'
        # レスポンスボディを確認
        body = JSON.parse(response.body)
        puts "レスポンスボディ: #{body.inspect}"
        expect(response).to have_http_status(:ok)
        expect(body['is_login']).to eq(false)
        expect(body['message']).to eq("ユーザーが存在しません")
      end
    end
  end

  describe "POST /auth/sign_in" do
    context "有効な認証情報の場合" do
      let!(:user) { create(:user, :confirmed) }
      let(:valid_params) { { email: user.email, password: 'password123' } }

      it "ログインできること" do
        post '/auth/sign_in', params: valid_params
        expect(response).to have_http_status(:ok)
        expect(response.headers['access-token']).to be_present
        expect(response.headers['client']).to be_present
        expect(response.headers['uid']).to eq(user.email)
      end
    end

    context "無効な認証情報の場合" do
      let!(:user) { create(:user, :confirmed) }
      let(:invalid_params) { { email: user.email, password: 'wrongpassword' } }

      it "ログインできないこと" do
        post '/auth/sign_in', params: invalid_params
        expect(response).to have_http_status(:unauthorized)
        expect(response.headers['access-token']).not_to be_present
      end
    end
  end

  describe "DELETE /auth/sign_out" do
    let(:user) { create(:user, :confirmed) }
    let(:auth_headers) { user.create_new_auth_token }

    it "ログアウトできること" do
      # ログイン
      post '/auth/sign_in', params: { email: user.email, password: 'password123' }
      # ログアウト
      delete '/auth/sign_out', headers: {
        'access-token': response.headers['access-token'],
        'client': response.headers['client'],
        'uid': response.headers['uid']
      }
      expect(response).to have_http_status(:ok)
      # ログアウト後は認証が必要なエンドポイントにアクセスできないことを確認
      get '/auth/sessions', headers: {
        'access-token': response.headers['access-token'],
        'client': response.headers['client'],
        'uid': response.headers['uid']
      }
      body = JSON.parse(response.body)
      expect(body['is_login']).to eq(false)
    end
  end
end
