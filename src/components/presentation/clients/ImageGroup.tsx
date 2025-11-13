import { Edit2Icon } from "lucide-react";
import { FC } from "react";

type ImageGroupProps = {
  title: string;
  images: { src: string; alt: string }[];
  onEdit?: () => void;
};

const ImageGroup: FC<ImageGroupProps> = ({ title, images, onEdit }) => (
  <div className="p-6 border-t">
    <div className="flex items-center space-x-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {onEdit && (
        <Edit2Icon
          size={16}
          className="cursor-pointer text-primary"
          onClick={onEdit}
        />
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className="w-80 h-40 rounded-lg shadow-md"
        />
      ))}
    </div>
  </div>
);
export default ImageGroup;
