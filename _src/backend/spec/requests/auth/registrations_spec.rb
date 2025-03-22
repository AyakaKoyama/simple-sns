require 'rails_helper'

RSpec.describe "Auth::Registrations", type: :request do
  describe "POST /auth" do
    context "有効なパラメータの場合" do
      let(:valid_attributes) { { email: "user@example.com", password: "password123", password_confirmation: "password123" } }

      it "ユーザーが作成されること" do
        expect {
          post '/auth', params: { user: valid_attributes }
        }.to change(User, :count).by(1)
      end

      it "ユーザーが作成された後、ログイン状態になること" do
        post '/auth', params: { user: valid_attributes }
        expect(response).to have_http_status(:created)
        expect(response.headers['Authorization']).to be_present
      end
    end

    context "無効なパラメータの場合" do
      let(:invalid_attributes) { { email: "user@example.com", password: "password123", password_confirmation: "password456" } }

      it "ユーザーが作成されないこと" do
        expect {
          post '/auth', params: { user: invalid_attributes }
        }.not_to change(User, :count)
      end

      it "ユーザーが作成されなかった後、ログイン状態にならないこと" do
        post '/auth', params: { user: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.headers['Authorization']).not_to be_present
      end
    end
  end
end
