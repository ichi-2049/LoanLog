import { useState } from 'react';
import { SearchResult, AddFriendResult } from '../types/friends';

export const useFriend = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const searchUser = async (id: string) => {
    setIsSearching(true);
    setSearchResult(null);
    
    try {
      const response = await fetch(`api/friend?id=${id}`);
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error(error)
      setSearchResult({ success: false, error: '検索中にエラーが発生しました' });
    } finally {
      setIsSearching(false);
    }
  };

  const addFriend = async (friendId: string): Promise<AddFriendResult> => {
    setIsAdding(true);
    
    try {
      const response = await fetch('/api/friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
        console.error(error)
      return { success: false, error: '友達追加中にエラーが発生しました' };
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isSearching,
    isAdding,
    searchResult,
    searchUser,
    addFriend,
  };
};