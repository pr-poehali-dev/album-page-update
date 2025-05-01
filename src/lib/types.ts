
export interface Album {
  id: string;
  name: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  filename: string;
  orientation: "portrait" | "landscape"; // 2:3 или 3:2
}

export interface AlbumViewSettings {
  gap: number;          // Отступ между фотографиями
  columns: number;      // Количество колонок в сетке
}
