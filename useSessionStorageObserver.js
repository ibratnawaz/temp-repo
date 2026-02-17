import { useState, useEffect } from 'react';

// 1. Utility to set item and dispatch custom event
const setSessionStorageItem = (key, value) => {
  sessionStorage.setItem(key, value);
  // Dispatch custom event to notify listeners
  window.dispatchEvent(new Event('sessionStorageChange'));
};

// 2. Custom hook to observe changes
const useSessionStorageObserver = (key) => {
  const [value, setValue] = useState(() => {
    return sessionStorage.getItem(key);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setValue(sessionStorage.getItem(key));
    };

    // Listen for custom event
    window.addEventListener('sessionStorageChange', handleStorageChange);

    return () => {
      // Cleanup listener
      window.removeEventListener('sessionStorageChange', handleStorageChange);
    };
  }, [key]);

  return [value, setSessionStorageItem];
};

// 3. Usage in component
function App() {
  const [theme, setTheme] = useSessionStorageObserver('theme');

  return (
    <div>
      <p>Current Theme: {theme || 'Light'}</p>
      <button onClick={() => setSessionStorageItem('theme', 'Dark')}>
        Set Dark
      </button>
      <button onClick={() => setSessionStorageItem('theme', 'Light')}>
        Set Light
      </button>
    </div>
  );
}

export default App;
