module V1
  class PostsController < ApiController

    def index
        posts= Post.all
        render json: posts
    end

    def show 
        post =Post.find(params[id]) 
        render json: post
    end

    def create 
        post =Post.find(params[id]) 
        
        if post.save
            renser json: post, status: :created
        else
            render json:{errors:post.errors.full_messages},status: :unprossable_entity
        end
    end

    def updated_at
        post =Post.find params[id]
        if post.update(post_params)
            render json: post
        else
            render json:{errors:post.errors.full_messages}, status: :unprossable_entity
        end
    end

    def destroy
        post =Post.find(params[id]) 
        post.destroy
        render json{}, status: :no_content
    end

    private

    def post_params
        params.require(:post).permit(:title, :content, :username)
    end

  end
end
