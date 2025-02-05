# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?

# rspec-rails を使用するための設定
require 'spec_helper'
# 本番や開発データベースを使用しないようにするための設定
ENV['RAILS_ENV'] ||= 'test'
# Rails の環境をテストモードに設定
require File.expand_path('../config/environment', __dir__)

# RSpec の実行環境が production になっていないかチェック
abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'

# （FactoryBot）spec/support ディレクトリ内のすべてのファイルを読み込む
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

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

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, type: :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://rspec.info/features/7-0/rspec-rails
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")
  
  # 不要な `should` の警告を抑制
  config.expect_with :rspec do |expectations|
    expectations.syntax = :expect
  end
end
