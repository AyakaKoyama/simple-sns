"use client";

import { ChangeEvent, useState } from "react";

interface ImagePreviewProps {
  onImageSelect: (file: File | null) => void;
  imageUrl?: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  onImageSelect,
  imageUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  console.log(imageUrl);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageSelect(null);
      setPreview(null);
    }
  };

  //
  return (
    <div>
      <label className="block mb-2 text-indigo-500">画像アップロード</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="プレビュー" className="max-w-xs rounded" />
        </div>
      )}
      {imageUrl && !preview && (
        <div className="mt-2">
          <img src={imageUrl} alt="既存の画像" className="max-w-xs rounded" />
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
