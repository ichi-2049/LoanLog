export type User = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  
  export type SearchResult = {
    success: boolean;
    user?: User;
    error?: string;
  };
  
  export type AddFriendResult = {
    success: boolean;
    error?: string;
  };