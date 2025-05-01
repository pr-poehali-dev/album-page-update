
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Album, AlbumViewSettings } from "@/lib/types";
import { 
  getAlbums, 
  addPhotoToAlbum, 
  deletePhotoFromAlbum,
  deleteAllPhotos,
  getAlbumViewSettings,
  saveViewSettings
} from "@/lib/storage";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SliderLabel from "@/components/ui/slider-label";

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [viewSettings, setViewSettings] = useState<AlbumViewSettings>({ gap: 4, columns: 4 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    
    const albums = getAlbums();
    const currentAlbum = albums.find(album => album.id === id);
    
    if (!currentAlbum) {
      navigate("/", { replace: true });
      return;
    }
    
    setAlbum(currentAlbum);
    setAlbumName(currentAlbum.name);
    
    // Загрузить настройки отображения
    const settings = getAlbumViewSettings(id);
    setViewSettings(settings);
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !album || !e.target.files || e.target.files.length === 0) return;
    
    try {
      const updatedAlbums = await addPhotoToAlbum(id, e.target.files);
      const updatedAlbum = updatedAlbums.find(a => a.id === id);
      
      if (updatedAlbum) {
        setAlbum(updatedAlbum);
      }
    } catch (error) {
      console.error("Ошибка при добавлении фотографий:", error);
      alert("Произошла ошибка при добавлении фотографий. Возможно, превышен лимит хранилища.");
    }
    
    // Сбросить input для возможности выбора тех же файлов повторно
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleDeletePhoto = (photoId: string) => {
    if (!id || !album) return;
    
    const updatedAlbums = deletePhotoFromAlbum(id, photoId);
    const updatedAlbum = updatedAlbums.find(a => a.id === id);
    if (updatedAlbum) {
      setAlbum(updatedAlbum);
    }
  };
  
  const handleDeleteAllPhotos = () => {
    if (!id || !album) return;
    
    const updatedAlbums = deleteAllPhotos(id);
    const updatedAlbum = updatedAlbums.find(a => a.id === id);
    if (updatedAlbum) {
      setAlbum(updatedAlbum);
    }
  };
  
  const handleAlbumNameDoubleClick = () => {
    setIsEditing(true);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };
  
  const handleNameSave = () => {
    if (!id || !album) return;
    
    const albums = getAlbums();
    const updatedAlbums = albums.map(a => 
      a.id === id ? { ...a, name: albumName } : a
    );
    
    localStorage.setItem("photo-albums", JSON.stringify(updatedAlbums));
    setAlbum({ ...album, name: albumName });
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setAlbumName(album?.name || "");
      setIsEditing(false);
    }
  };
  
  const handleGapChange = (value: number) => {
    const newSettings = { ...viewSettings, gap: value };
    setViewSettings(newSettings);
    if (id) {
      saveViewSettings(id, newSettings);
    }
  };
  
  const handleColumnsChange = (value: number) => {
    const newSettings = { ...viewSettings, columns: value };
    setViewSettings(newSettings);
    if (id) {
      saveViewSettings(id, newSettings);
    }
  };

  if (!album) {
    return <div className="p-8 text-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
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
                value={albumName}
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
                {album.name}
              </h1>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <Button 
              onClick={handleAddPhoto}
              className="flex items-center gap-2"
            >
              <Icon name="Plus" size={16} />
              Добавить фото
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteAllPhotos}
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

        {album.photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
            <Icon name="Image" size={64} className="text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-4">В этом альбоме пока нет фотографий</p>
            <Button 
              onClick={handleAddPhoto}
              className="flex items-center gap-2"
            >
              <Icon name="Plus" size={16} />
              Добавить фото
            </Button>
          </div>
        ) : (
          <div 
            className="grid gap-4" 
            style={{ 
              gridTemplateColumns: `repeat(${viewSettings.columns}, 1fr)`,
              gap: `${viewSettings.gap * 4}px`
            }}
          >
            {album.photos.map((photo) => (
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
                    onClick={() => handleDeletePhoto(photo.id)}
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
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
