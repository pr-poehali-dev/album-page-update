
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Album } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface AlbumCardProps {
  album: Album;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const AlbumCard = ({ album, onDelete, onRename }: AlbumCardProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [albumName, setAlbumName] = useState(album.name);

  const handleAlbumClick = () => {
    navigate(`/album/${album.id}`);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  const handleNameSave = () => {
    onRename(album.id, albumName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setAlbumName(album.name);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(album.id);
  };

  return (
    <Card
      className="w-56 h-64 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleAlbumClick}
    >


      <CardContent className="flex-1 flex items-center justify-center p-4 relative">
        {album.photos.length > 0 ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden rounded">
            <img
              src={album.photos[0].url}
              alt={album.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
            <Icon name="Camera" size={64} className="text-gray-400" />
          </div>
        )}


        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleDelete}
        >
          <Icon name="Trash2" size={16} />
        </Button>
      </CardContent>
      <CardFooter className="p-2">
        {isEditing ? (
          <input
            type="text"
            value={albumName}
            onChange={handleNameChange}
            onBlur={handleNameSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full p-1 border rounded"
          />
        ) : (
          <div
            className="w-full text-center font-medium truncate"
            onDoubleClick={handleDoubleClick}
          >
            {album.name}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AlbumCard;
