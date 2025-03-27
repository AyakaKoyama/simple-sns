class Post < ApplicationRecord
    validates :title, presence: true
    validates :username, presence:true, uniqueness:true

    has_one_attached :image
    # 複数のイメージを持たせる
    has_many_attached :images

    validate :image_content_type
    validate :image_size
    
      def image_content_type
      if image.attached? && !image.content_type.in?(%w[image/jpeg image/png image/gif])
        errors.add(:image, '：ファイル形式が、JPEG, PNG, GIF以外になってます。ファイル形式をご確認ください。')
      end
    end
  
    def image_size
      if image.attached? && image.blob.byte_size > 1.megabytes
        errors.add(:image, '：1MB以下のファイルをアップロードしてください。')
      end
    end

    def image_as_thumbnail
      return unless image.content_type.in?(%w[image/jpeg image/png])
      image.variant(resize_to_limit: [200, 100]).processed
    end
end
