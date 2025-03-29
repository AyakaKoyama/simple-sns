"use client";

import { useState } from "react";

interface ImagePreviewProps {
  onImageSelect: (file: File | null) => void;
}

export default function ImagePreview({ onImageSelect }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageSelect(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      <label className="block mb-2 text-indigo-500">画像アップロード</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <img src={preview} alt="プレビュー" className="mt-2 max-w-xs rounded" />
      )}
    </div>
  );
}
