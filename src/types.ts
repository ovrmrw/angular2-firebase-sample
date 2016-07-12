export interface FirebaseUser {
  uid?: string;
  displayName?: string;
  email?: string;
  name?: string;
  providerId?: string;
  timestamp?: number;
  photoURL?: string;
}

export interface FirebaseNote {
  noteid?: string;
  title?: string;
  content?: string;
  timestamp?: number;
  author?: { [key: string]: any };
  sharedTo?: { [key: string]: boolean };
  ary?: string[];
}

export interface FirebaseNoteIndex {
  noteid?: string;
  readonly?: boolean;
  timestamp?: number;
}