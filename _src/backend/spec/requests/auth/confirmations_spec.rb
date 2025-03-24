require 'rails_helper'

RSpec.describe "Auth::Confirmations", type: :request do
  describe "GET /auth/confirmation" do
    let(:redirect_url) { 'http://localhost:3000' }
    let(:user) { create(:user) } # 未確認ユーザー
    
    before do
      # メール送信をスキップ
      ActionMailer::Base.delivery_method = :test
      ActionMailer::Base.perform_deliveries = false
    end
    
    context "有効な確認トークンの場合" do
      it "ユーザーアカウントが確認されること" do
        # 未確認状態を確認
        expect(user.confirmed_at).to be_nil
        
        # 確認トークンを取得
        confirmation_token = user.confirmation_token
        
        # GETリクエストで確認
        get "/auth/confirmation", params: { confirmation_token: confirmation_token, redirect_url: redirect_url }
        
        # リダイレクトされることを確認
        expect(response).to have_http_status(:found)
        expect(response).to redirect_to(/#{redirect_url}/)
        
        # ユーザーが確認済みになることを確認
        user.reload
        expect(user.confirmed_at).not_to be_nil
      end
    end
    
    context "無効な確認トークンの場合" do
      it "ユーザーアカウントが確認されないこと" do
        # 無効なトークンでGETリクエスト
        get "/auth/confirmation", params: { confirmation_token: "invalid_token", redirect_url: redirect_url }
        
        # リダイレクトされることを確認（エラーパラメータ付き）
        expect(response).to have_http_status(:found)
        expect(response.location).to include("account_confirmation_success=false")
      end
    end
    
    context "既に確認済みのユーザーの場合" do
      let(:confirmed_user) { create(:user, :confirmed) }
      
      it "リダイレクトURLにエラーパラメータが付くこと" do
        # 確認済みユーザーの確認トークンを取得
        confirmation_token = confirmed_user.confirmation_token
        
        # 確認リクエスト
        get "/auth/confirmation", params: { confirmation_token: confirmation_token, redirect_url: redirect_url }
        
        # リダイレクトされることを確認
        expect(response).to have_http_status(:found)
        expect(response.location).to include("account_confirmation_success=false")
      end
    end
  end
  
  describe "POST /auth/confirmation" do
    let(:user) { create(:user) } # 未確認ユーザー
    let(:redirect_url) { 'http://localhost:3000' }
    
    before do
      # メール送信をスキップ
      ActionMailer::Base.delivery_method = :test
      ActionMailer::Base.perform_deliveries = false
    end
    
    context "有効なメールアドレスの場合" do
      it "確認メール再送信が成功すること" do
        post "/auth/confirmation", params: { email: user.email, redirect_url: redirect_url }
        
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body['success']).to eq(true)
      end
    end
    
    context "無効なメールアドレスの場合" do
      it "エラーが返されること" do
        post "/auth/confirmation", params: { email: "invalid@example.com", redirect_url: redirect_url }
        
        expect(response).to have_http_status(:not_found)
      end
    end
    
    context "既に確認済みのユーザーの場合" do
      let(:confirmed_user) { create(:user, :confirmed) }
      
      it "エラーが返されること" do
        post "/auth/confirmation", params: { email: confirmed_user.email, redirect_url: redirect_url }
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end 