import { useEffect, useState } from 'react';

//? used in Autocomplete component for member addition to avoid making API requests on every keystroke.

//! We return the user input after the delay, then send query to backend with this user input.

//? In this way, we circumvent the issue of sending requests on every keystroke. Less breaks on typing --> less number of requests to backend.

export const useDebounce = <T>(userInput: T, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<T>(userInput);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceValue(userInput);
    }, delay);

    // timers arent auto deleted by browsers, so remove them before the useEffect runs again to avoid multiple timer conflicts(except on component mount).
    return () => {
      clearTimeout(timerId);
    };
  }, [userInput, delay]);

  return debounceValue;
};
