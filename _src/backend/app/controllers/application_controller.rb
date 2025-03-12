class ApplicationController < ActionController::Base
  # Cookie や CORS の設定をする拡張機能
  include DeviseTokenAuth::Concerns::SetUserByToken
  protect_from_forgery with: :null_session
  # APIモードで使用するため、CSRFトークンの検証をスキップ
  skip_before_action :verify_authenticity_token
end
