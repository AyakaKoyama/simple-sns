# 本番や開発データベースを使用しないようにするための設定
ENV['RAILS_ENV'] ||= 'test'
# Rails の環境をテストモードに設定
require File.expand_path('../config/environment', __dir__)

# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'rspec/rails'
# rspec-rails を使用するための設定
require 'spec_helper'
require_relative '../config/environment'
# RSpec の実行環境が production になっていないかチェック
abort('The Rails environment is running in production mode!') if Rails.env.production?

# （FactoryBot）spec/support ディレクトリ内のすべてのファイルを読み込む
Dir[Rails.root.join('spec/support/**/*.rb')].sort.each { |f| require f }

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end
RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = Rails.root.join('spec/fixtures')
  # FactoryBot を使用するための設定
  config.include FactoryBot::Syntax::Methods
  # テストが DB を変更した場合にリセットする設定（RSpec の transactions を使用）
  config.use_transactional_fixtures = true

  # テストが失敗した場合にスクリーンショットを撮る設定
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  # 不要な `should` の警告を抑制
  config.expect_with :rspec do |expectations|
    expectations.syntax = :expect
  end

  # Devise Token Auth のテスト用設定を追加
  config.include Devise::Test::IntegrationHelpers, type: :request
  # config.include DeviseTokenAuth::Test::ControllerHelpers, type: :request

  # 認証ヘッダーを生成するヘルパーメソッド
  def auth_tokens_for_user(user)
    user.create_new_auth_token
  end

  # テスト環境のホスト設定を追加
  config.before(:each) do
    Rails.application.routes.default_url_options[:host] = 'localhost:3001'
  end

  # devise_token_authのメール送信をスキップ
  config.before(:each) do
    # スキップするのはUserモデル自体のコールバックメソッド
    allow_any_instance_of(User)
    .to receive(:send_on_create_confirmation_instructions)
    .and_return(true)
  end
end
