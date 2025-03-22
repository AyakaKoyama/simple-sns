require 'rails_helper'

RSpec.describe User, type: :model do
  context '有効な場合' do
    it '有効なユーザーが作成できること' do
      user = User.new(email: 'user@example.com', password: 'password123', password_confirmation: 'password123')
      # confirmableが有効なため、email確認が必須で confirmed_at がnilでは保存不可
      user.confirmed_at = Time.current
      expect(user).to be_valid
    end

    it '有効なユーザーが保存できること' do
      user = User.new(email: 'user@example.com', password: 'password123', password_confirmation: 'password123')
      user.confirmed_at = Time.current
      expect(user.save).to be_truthy
    end
  end

  context '無効な場合' do

    it 'メールアドレスがなければ無効であること' do
      user = User.new(email: nil)
      user.valid?
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'パスワードがなければ無効であること' do
      user = User.new(password: nil)
      user.valid?
      expect(user.errors[:password]).to include("can't be blank")
    end

    it '無効なメールアドレスのユーザーは無効であること' do
      user = User.new(email: 'invalid@example', password: 'password123', password_confirmation: 'password123')
      user.valid?
      expect(user.errors[:email]).to include('is not an email')
    end

    it 'パスワードが短すぎるユーザーは無効であること' do
      user = User.new(email: 'user@example.com', password: 'pass', password_confirmation: 'pass')
      user.valid?
      expect(user.errors[:password]).to include('is too short (minimum is 6 characters)')
    end

    it 'パスワードとパスワード確認が一致しないユーザーは無効であること' do
      user = User.new(email: 'user@example.com', password: 'password123', password_confirmation: 'different')
      user.valid?
      expect(user.errors[:password_confirmation]).to include('doesn\'t match Password')
    end
  end

  describe 'トークン認証' do
    let(:user) { User.create(email: 'test@example.com', password: 'password123') }

    it 'トークン関連の属性を持つこと' do
      expect(user).to respond_to(:tokens)
      expect(user).to respond_to(:create_new_auth_token)
    end
  end

end