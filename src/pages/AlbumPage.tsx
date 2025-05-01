
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Album, AlbumViewSettings } from "@/lib/types";
import { 
  getAlbums, 
  addPhotoToAlbum, 
  deletePhotoFromAlbum,
  deleteAllPhotos,
  getAlbumViewSettings,
  saveViewSettings
} from "@/lib/storage";
import AlbumHeader from "@/components/AlbumHeader";
import PhotoGrid from "@/components/PhotoGrid";
import EmptyAlbumState from "@/components/EmptyAlbumState";

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
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
    
    // Загрузить настройки отображения
    const settings = getAlbumViewSettings(id);
    setViewSettings(settings);
  }, [id, navigate]);

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
  
  const handleNameChange = (newName: string) => {
    if (!id || !album) return;
    
    const albums = getAlbums();
    const updatedAlbums = albums.map(a => 
      a.id === id ? { ...a, name: newName } : a
    );
    
    localStorage.setItem("photo-albums", JSON.stringify(updatedAlbums));
    setAlbum({ ...album, name: newName });
  };
  
  const handleViewSettingsChange = (newSettings: AlbumViewSettings) => {
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
        <AlbumHeader
          albumId={id || ""}
          albumName={album.name}
          viewSettings={viewSettings}
          onNameChange={handleNameChange}
          onViewSettingsChange={handleViewSettingsChange}
          onAddPhoto={handleAddPhoto}
          onDeleteAllPhotos={handleDeleteAllPhotos}
          fileInputRef={fileInputRef}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        {album.photos.length === 0 ? (
          <EmptyAlbumState onAddPhoto={handleAddPhoto} />
        ) : (
          <PhotoGrid 
            photos={album.photos} 
            viewSettings={viewSettings} 
            onDeletePhoto={handleDeletePhoto} 
          />
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
