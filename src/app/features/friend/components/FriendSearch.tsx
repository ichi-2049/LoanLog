'use client';

import { useState } from 'react';
import { useFriend } from '../hooks/useFriend';

export const FriendSearch = () => {
  const [searchId, setSearchId] = useState('');
  const { isSearching, isAdding, searchResult, searchUser, addFriend } = useFriend();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      searchUser(searchId.trim());
    }
  };

  const handleAddFriend = async () => {
    if (searchResult?.user) {
      const result = await addFriend(searchResult.user.id);
      if (result.success) {
        alert('友達を追加しました！');
        setSearchId('');
      } else {
        alert(result.error || '友達の追加に失敗しました');
      }
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">友達追加</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ID（完全一致）"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            disabled={isSearching}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isSearching || !searchId.trim()}
          >
            検索
          </button>
        </div>
      </form>

      {isSearching && (
        <div className="text-white mt-4">検索中...</div>
      )}

      {searchResult && !isSearching && (
        <div className="mt-4">
          {searchResult.success && searchResult.user ? (
            <div className="bg-gray-700 p-4 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">{searchResult.user.name || 'No Name'}</p>
                  <p className="text-gray-400 text-sm">{searchResult.user.email}</p>
                </div>
                <button
                  onClick={handleAddFriend}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  disabled={isAdding}
                >
                  {isAdding ? '追加中...' : '追加'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-red-500">
              {searchResult.error || 'ユーザーが見つかりませんでした'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};