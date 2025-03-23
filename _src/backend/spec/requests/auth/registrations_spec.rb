require 'rails_helper'

RSpec.describe "Auth::Registrations", type: :request do
  # テスト前にメール送信をスキップ
  before(:each) do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = false 
    # 自動メール確認を回避
    allow_any_instance_of(User).to receive(:send_on_create_confirmation_instructions).and_return(true)
    allow_any_instance_of(User).to receive(:skip_confirmation_notification!).and_return(true)   
    # テスト用にユーザーの確認済み設定
    User.class_eval do
      before_create :skip_confirmation_for_test     
      def skip_confirmation_for_test
        self.confirmed_at = Time.current if Rails.env.test?
      end
    end
  end

  describe "POST /auth" do
    context "有効なパラメータの場合" do
      let(:valid_attributes) do
        {
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123',
          confirm_success_url: 'http://localhost:3001'
        }
      end

      it "ユーザーが作成されること" do
        expect {
          post '/auth', params: valid_attributes
        }.to change(User, :count).by(1)
      end

      it "ユーザーが作成された後、レスポンスが正常に返ること" do
        post '/auth', params: valid_attributes
        # レスポンスボディを確認
        body = JSON.parse(response.body)
        puts "レスポンスボディ: #{body.inspect}"
        # レスポンスヘッダーを確認
        puts "レスポンスヘッダー: #{response.headers.inspect}"
        # レスポンスのステータスコードを確認
        expect(response).to have_http_status(:ok) 
        # DBにユーザーが作成されたことを確認
        expect(User.find_by(email: valid_attributes[:email])).to be_present
      end

      # 別のテストで認証をテスト
      it "作成したユーザーでサインインできること" do
        # ユーザー作成
        post '/auth', params: valid_attributes
        # サインイン
        signin_params = {
          email: valid_attributes[:email],
          password: valid_attributes[:password]
        }       
        post '/auth/sign_in', params: signin_params       
        # サインイン後のヘッダーチェック
        expect(response).to have_http_status(:ok)
        expect(response.headers['access-token']).to be_present
        expect(response.headers['client']).to be_present
        expect(response.headers['uid']).to eq(valid_attributes[:email])
      end
    end

    context "無効なパラメータの場合" do
      let(:invalid_attributes) do
        {
          email: 'invalid_email',
          password: 'password123',
          password_confirmation: 'password456',
          confirm_success_url: 'http://localhost:3001'
        }
      end

      it "ユーザーが作成されないこと" do
        expect {
          post '/auth', params: invalid_attributes
        }.not_to change(User, :count)
      end

      it "ユーザーが作成されなかった後、ログイン状態にならないこと" do
        post '/auth', params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.headers['access-token']).not_to be_present
      end
    end
  end
end
