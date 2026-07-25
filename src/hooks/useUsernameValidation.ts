import { useState, useEffect } from 'react';
import { useCheckUsername } from './useUsers';

export function useUsernameValidation(initialUsername: string) {
  const [username, setUsername] = useState(initialUsername);
  const [debouncedUsername, setDebouncedUsername] = useState(initialUsername);

  // Debounce the username input by 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  const { data, isLoading, isFetching } = useCheckUsername(debouncedUsername);

  return {
    username,
    setUsername,
    isValidating: isLoading || isFetching || username !== debouncedUsername,
    isAvailable: data?.data?.available,
    suggestions: data?.data?.suggestions || [],
  };
}
