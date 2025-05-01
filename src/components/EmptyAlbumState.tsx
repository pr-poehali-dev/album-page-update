
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface EmptyAlbumStateProps {
  onAddPhoto: () => void;
}

const EmptyAlbumState = ({ onAddPhoto }: EmptyAlbumStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
      <Icon name="Image" size={64} className="text-gray-300 mb-4" />
      <p className="text-xl text-gray-500 mb-4">В этом альбоме пока нет фотографий</p>
      <Button 
        onClick={onAddPhoto}
        className="flex items-center gap-2"
      >
        <Icon name="Plus" size={16} />
        Добавить фото
      </Button>
    </div>
  );
};

export default EmptyAlbumState;
