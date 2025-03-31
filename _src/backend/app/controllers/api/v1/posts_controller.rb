module Api
  module V1
    class PostsController < ApiController

      def index
        posts = Post.all.map do |post|
          post.as_json.merge(image_url: post.image.attached? ? url_for(post.image) : nil)
        end
        render json: posts
      end

      def show
        post = Post.find(params[:id])
        render json: post.as_json.merge(image_url: post.image.attached? ? url_for(post.image) : nil)
      end

      def create
        post = Post.new(post_params)
      
        if params[:image]
          Rails.logger.debug "Image received: #{params[:image].inspect}" # 画像が渡っているか確認
          post.image.attach(params[:image])
        else
          Rails.logger.debug "No image received"
        end
      
        if post.save
          render json: post.as_json.merge(image_url: post.image.attached? ? url_for(post.image) : nil), status: :created
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        post = Post.find(params[:id])
        if post.update(post_params)
          render json: post.as_json.merge(image_url: post.image.attached? ? url_for(post.image) : nil)
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        post = Post.find(params[:id])
        post.destroy
        render json: {}, status: :no_content
      end

      def delete_image
        @blog = Blog.find(params[:id])
        @blog.image.purge
        respond_to do |format|
        render turbo_stream: turbo_stream.remove(@blog.image)
        end
      end

      private

      def post_params
        params.require(:post).permit(:title, :content, :username, :image)
      end
    end
  end
end