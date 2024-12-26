import { useState, useEffect } from 'react';
import { Friend } from '../types/loan';

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/friend/list');
        const data = await response.json();
        if (data.success) {
          setFriends(data.friends);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return { friends, isLoading };
};