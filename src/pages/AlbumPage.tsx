
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Album } from "@/lib/types";
import { 
  getAlbums, 
  addPhotoToAlbum, 
  deletePhotoFromAlbum 
} from "@/lib/storage";

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const albums = getAlbums();
    const currentAlbum = albums.find(album => album.id === id);
    
    if (!currentAlbum) {
      navigate("/", { replace: true });
      return;
    }
    
    setAlbum(currentAlbum);
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleAddPhoto = () => {
    if (!id || !album) return;
    
    // Используем случайное изображение с Unsplash для демонстрации
    const randomImageId = Math.floor(Math.random() * 1000);
    const photoUrl = `https://source.unsplash.com/random/300x300?sig=${randomImageId}`;
    
    const updatedAlbums = addPhotoToAlbum(id, photoUrl);
    const updatedAlbum = updatedAlbums.find(a => a.id === id);
    if (updatedAlbum) {
      setAlbum(updatedAlbum);
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
            <h1 className="text-3xl font-bold">{album.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleAddPhoto}
              className="flex items-center gap-2"
            >
              <Icon name="Plus" size={16} />
              Добавить фото
            </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img 
                  src={photo.url} 
                  alt="" 
                  className="w-full aspect-square object-cover rounded-md"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumPage;
