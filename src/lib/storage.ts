
import { Album, Photo, AlbumViewSettings } from "./types";

// Ключи для localStorage
const ALBUMS_STORAGE_KEY = "photo-albums";
const VIEW_SETTINGS_KEY = "album-view-settings";

// Получить все альбомы из localStorage
export const getAlbums = (): Album[] => {
  const storedAlbums = localStorage.getItem(ALBUMS_STORAGE_KEY);
  if (!storedAlbums) return [];
  
  try {
    return JSON.parse(storedAlbums);
  } catch (error) {
    console.error("Ошибка при чтении альбомов:", error);
    return [];
  }
};

// Сохранить все альбомы в localStorage
export const saveAlbums = (albums: Album[]): void => {
  localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums));
};

// Добавить новый альбом
export const addAlbum = (): Album[] => {
  const albums = getAlbums();
  const newAlbum: Album = {
    id: Date.now().toString(),
    name: "new",
    photos: []
  };
  
  const updatedAlbums = [...albums, newAlbum];
  saveAlbums(updatedAlbums);
  return updatedAlbums;
};

// Удалить альбом по ID
export const deleteAlbum = (albumId: string): Album[] => {
  const albums = getAlbums();
  const updatedAlbums = albums.filter(album => album.id !== albumId);
  saveAlbums(updatedAlbums);
  return updatedAlbums;
};

// Переименовать альбом
export const renameAlbum = (albumId: string, newName: string): Album[] => {
  const albums = getAlbums();
  const updatedAlbums = albums.map(album => 
    album.id === albumId ? { ...album, name: newName } : album
  );
  saveAlbums(updatedAlbums);
  return updatedAlbums;
};

// Добавить фото в альбом
export const addPhotoToAlbum = (albumId: string, file: File): Promise<Album[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const photoUrl = event.target?.result as string;
      
      const albums = getAlbums();
      const updatedAlbums = albums.map(album => {
        if (album.id === albumId) {
          // Определить ориентацию по соотношению сторон
          const img = new Image();
          img.src = photoUrl;
          
          const newPhoto: Photo = {
            id: Date.now().toString(),
            url: photoUrl,
            filename: file.name,
            orientation: img.width > img.height ? "landscape" : "portrait"
          };
          
          return { ...album, photos: [...album.photos, newPhoto] };
        }
        return album;
      });
      
      saveAlbums(updatedAlbums);
      resolve(updatedAlbums);
    };
    
    reader.readAsDataURL(file);
  });
};

// Удалить фото из альбома
export const deletePhotoFromAlbum = (albumId: string, photoId: string): Album[] => {
  const albums = getAlbums();
  const updatedAlbums = albums.map(album => {
    if (album.id === albumId) {
      return { 
        ...album, 
        photos: album.photos.filter(photo => photo.id !== photoId) 
      };
    }
    return album;
  });
  
  saveAlbums(updatedAlbums);
  return updatedAlbums;
};

// Удалить все альбомы
export const deleteAllAlbums = (): Album[] => {
  const emptyAlbums: Album[] = [];
  saveAlbums(emptyAlbums);
  return emptyAlbums;
};

// Удалить все фотографии из альбома
export const deleteAllPhotos = (albumId: string): Album[] => {
  const albums = getAlbums();
  const updatedAlbums = albums.map(album => {
    if (album.id === albumId) {
      return { ...album, photos: [] };
    }
    return album;
  });
  
  saveAlbums(updatedAlbums);
  return updatedAlbums;
};

// Сохранить настройки отображения альбома
export const saveViewSettings = (albumId: string, settings: AlbumViewSettings): void => {
  const allSettings = getViewSettings();
  allSettings[albumId] = settings;
  localStorage.setItem(VIEW_SETTINGS_KEY, JSON.stringify(allSettings));
};

// Получить настройки отображения альбома
export const getViewSettings = (): Record<string, AlbumViewSettings> => {
  const storedSettings = localStorage.getItem(VIEW_SETTINGS_KEY);
  if (!storedSettings) return {};
  
  try {
    return JSON.parse(storedSettings);
  } catch (error) {
    console.error("Ошибка при чтении настроек отображения:", error);
    return {};
  }
};

// Получить настройки отображения конкретного альбома
export const getAlbumViewSettings = (albumId: string): AlbumViewSettings => {
  const allSettings = getViewSettings();
  return allSettings[albumId] || { gap: 4, columns: 4 };
};
