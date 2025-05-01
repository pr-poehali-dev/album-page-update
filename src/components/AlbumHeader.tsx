
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SliderLabel from "@/components/ui/slider-label";
import { AlbumViewSettings } from "@/lib/types";

interface AlbumHeaderProps {
  albumId: string;
  albumName: string;
  viewSettings: AlbumViewSettings;
  onNameChange: (newName: string) => void;
  onViewSettingsChange: (settings: AlbumViewSettings) => void;
  onAddPhoto: () => void;
  onDeleteAllPhotos: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const AlbumHeader = ({
  albumId,
  albumName,
  viewSettings,
  onNameChange,
  onViewSettingsChange,
  onAddPhoto,
  onDeleteAllPhotos,
  fileInputRef
}: AlbumHeaderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(albumName);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleAlbumNameDoubleClick = () => {
    setIsEditing(true);
    setEditingName(albumName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleNameSave = () => {
    onNameChange(editingName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setEditingName(albumName);
      setIsEditing(false);
    }
  };

  const handleGapChange = (value: number) => {
    onViewSettingsChange({ ...viewSettings, gap: value });
  };

  const handleColumnsChange = (value: number) => {
    onViewSettingsChange({ ...viewSettings, columns: value });
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </Button>
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={handleNameChange}
            onBlur={handleNameSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-3xl font-bold p-1 border rounded"
          />
        ) : (
          <h1 
            className="text-3xl font-bold cursor-pointer" 
            onDoubleClick={handleAlbumNameDoubleClick}
          >
            {albumName}
          </h1>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
        />
        <Button 
          onClick={onAddPhoto}
          className="flex items-center gap-2"
        >
          <Icon name="Plus" size={16} />
          Добавить фото
        </Button>
        <Button 
          variant="destructive"
          onClick={onDeleteAllPhotos}
          className="flex items-center gap-2"
        >
          <Icon name="Trash2" size={16} />
          Удалить все фото
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Настройки вида
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Настройки отображения</h3>
              <SliderLabel
                label="Количество колонок"
                value={viewSettings.columns}
                onChange={handleColumnsChange}
                min={2}
                max={10}
                valueDisplay={`${viewSettings.columns}`}
              />
              <SliderLabel
                label="Отступ между фото"
                value={viewSettings.gap}
                onChange={handleGapChange}
                min={1}
                max={12}
                valueDisplay={`${viewSettings.gap * 4}px`}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AlbumHeader;
