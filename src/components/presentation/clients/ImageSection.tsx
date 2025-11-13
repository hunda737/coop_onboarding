import { FC } from "react";
import { Edit2Icon } from "lucide-react";

type ImageSectionProps = {
  title: string;
  imageSrc: string | null;
  onEdit?: () => void;
  altText: string;
};

const ImageSection: FC<ImageSectionProps> = ({
  title,
  imageSrc,
  onEdit,
  altText,
}) => (
  <div className="space-y-2">
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
    {imageSrc && (
      <img
        src={imageSrc}
        alt={altText}
        className="w-80 h-40 rounded-lg shadow-md"
      />
    )}
  </div>
);

export default ImageSection;
