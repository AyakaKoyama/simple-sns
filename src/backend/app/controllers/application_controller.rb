class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  
  # APIモードで使用するため、CSRFトークンの検証をスキップ
  skip_before_action :verify_authenticity_token
end 