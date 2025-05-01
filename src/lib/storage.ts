
import { Album, Photo } from "./types";

// Ключи для localStorage
const ALBUMS_STORAGE_KEY = "photo-albums";

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
export const addPhotoToAlbum = (albumId: string, photoUrl: string): Album[] => {
  const albums = getAlbums();
  const updatedAlbums = albums.map(album => {
    if (album.id === albumId) {
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: photoUrl
      };
      return { ...album, photos: [...album.photos, newPhoto] };
    }
    return album;
  });
  
  saveAlbums(updatedAlbums);
  return updatedAlbums;
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
