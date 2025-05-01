
export interface Album {
  id: string;
  name: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
}
