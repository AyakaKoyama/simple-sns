module Api
  module V1
    class PostsController < ApiController
      def index
        posts = Post.all
        render json: posts
      end

      def show
        post = Post.find(params[:id])
        render json: post
      end

      def create
        post = Post.new(post_params)

        if post.save
          render json: post, status: :created
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        post = Post.find(params[:id])
        if post.update(post_params)
          render json: post
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
        params.require(:post).permit(:title, :content, :username, :image, images: [])
      end
    end
  end
end