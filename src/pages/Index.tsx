
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AlbumCard from "@/components/AlbumCard";
import { Album } from "@/lib/types";
import { 
  getAlbums, 
  addAlbum, 
  deleteAlbum, 
  renameAlbum, 
  deleteAllAlbums 
} from "@/lib/storage";

const Index = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    // Загрузка альбомов при монтировании компонента
    setAlbums(getAlbums());
  }, []);

  const handleAddAlbum = () => {
    const updatedAlbums = addAlbum();
    setAlbums(updatedAlbums);
  };

  const handleDeleteAlbum = (albumId: string) => {
    const updatedAlbums = deleteAlbum(albumId);
    setAlbums(updatedAlbums);
  };

  const handleRenameAlbum = (albumId: string, newName: string) => {
    const updatedAlbums = renameAlbum(albumId, newName);
    setAlbums(updatedAlbums);
  };

  const handleDeleteAllAlbums = () => {
    const updatedAlbums = deleteAllAlbums();
    setAlbums(updatedAlbums);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Мои фотоальбомы</h1>
          <div className="flex gap-2">
            <Button onClick={handleAddAlbum} className="flex items-center gap-2">
              <Icon name="Plus" size={16} />
              Добавить альбом
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllAlbums}
              className="flex items-center gap-2"
            >
              <Icon name="Trash2" size={16} />
              Удалить все альбомы
            </Button>
          </div>
        </div>



          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50" onClick={handleAddAlbum}>
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
              <Icon name="Plus" size={32} className="text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 mb-4">У вас пока нет альбомов</p>
            <p className="text-sm text-gray-400">Нажмите, чтобы создать альбом</p>
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onDelete={handleDeleteAlbum}
                onRename={handleRenameAlbum}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
