'use client';

import { useState, useEffect } from 'react';
import { useFriend } from '../hooks/useFriend';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const FriendSearch = () => {
  const [searchId, setSearchId] = useState('');
  const { data: session } = useSession();
  const { 
    isSearching, 
    isAdding, 
    searchResult, 
    friends,
    searchUser, 
    addFriend,
    loadFriends 
  } = useFriend();

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleCopyId = async () => {
    if (session?.user?.id) {
      try {
        await navigator.clipboard.writeText(session.user.id);
        toast.success("IDをクリップボードにコピーしました", { autoClose: 3000 });
      } catch (err) {
        console.error(err)
        toast.error("コピーに失敗しました", { autoClose: 3000 });
      }
    }
  };

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
        toast.success("友達を追加しました！", { autoClose: 3000 });
        setSearchId('');
        loadFriends();
      } else {
        toast.error(result.error || '友達の追加に失敗しました', { autoClose: 3000 });
      }
    }
  };

  const isAlreadyFriend = (userId: string) => {
    return friends.some(friend => friend.id === userId);
  };

  return (
    <div className="space-y-6">
      {/* ユーザープロファイルセクション */}
      <div className="p-4 bg-gray-800 rounded-lg">
  <h2 className="text-xl font-bold mb-4 text-white">あなたのプロフィール</h2>
  <div className="bg-gray-700 p-4 rounded">
    <div className="flex items-center gap-4">
      {session?.user?.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || ''}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <div className="flex-grow">
        {/* 名前とメール */}
        <p className="text-white">{session?.user?.name || 'No Name'}</p>
        <p className="text-gray-400 text-sm">{session?.user?.email}</p>
        
        {/* IDとボタン */}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm text-gray-400">ID: {session?.user?.id}</p>
          <button
            onClick={handleCopyId}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            copy
          </button>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* 友達追加セクション */}
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
                  {isAlreadyFriend(searchResult.user.id) ? (
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded opacity-50 cursor-not-allowed"
                      disabled
                    >
                      追加済み
                    </button>
                  ) : (
                    <button
                      onClick={handleAddFriend}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                      disabled={isAdding}
                    >
                      {isAdding ? '追加中...' : '追加'}
                    </button>
                  )}
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

      {/* 友達一覧セクション */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">友達一覧</h2>
        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.id} className="bg-gray-700 p-4 rounded">
              <div className="flex items-center gap-4">
                {friend.image && (
                  <Image
                    src={friend.image}
                    alt={friend.name || ''}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-white">{friend.name || 'No Name'}</p>
                  <p className="text-gray-400 text-sm">{friend.email}</p>
                </div>
              </div>
            </div>
          ))}
          {friends.length === 0 && (
            <p className="text-gray-400 text-center">友達がいません</p>
          )}
        </div>
      </div>
    </div>
  );
};
