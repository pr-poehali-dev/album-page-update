
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Photo, AlbumViewSettings } from "@/lib/types";

interface PhotoGridProps {
  photos: Photo[];
  viewSettings: AlbumViewSettings;
  onDeletePhoto: (photoId: string) => void;
}

const PhotoGrid = ({ photos, viewSettings, onDeletePhoto }: PhotoGridProps) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div 
      className="grid gap-4" 
      style={{ 
        gridTemplateColumns: `repeat(${viewSettings.columns}, 1fr)`,
        gap: `${viewSettings.gap * 4}px`
      }}
    >
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <div 
            className={`
              relative overflow-hidden rounded-md border border-gray-200
              ${photo.orientation === "portrait" ? "aspect-[2/3]" : "aspect-[3/2]"}
            `}
          >
            <img 
              src={photo.url} 
              alt={photo.filename} 
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDeletePhoto(photo.id)}
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
          <div className="mt-1 text-sm text-gray-600 truncate">
            {photo.filename}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
