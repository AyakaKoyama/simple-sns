Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 基本的なメソッドを一括で表したい場合
      resources :posts

    # 個別にメソッドを定義したい場合
    # get '/posts', to: 'posts#index'
    # post '/posts', to: 'posts#create'
    # get '/posts/:id', to: 'posts#show'
    # patch '/posts/:id', to: 'posts#update'
    # delete '/posts/:id', to: 'posts#destroy'
    end
  end
end
