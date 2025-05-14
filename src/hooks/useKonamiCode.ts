import { useState, useEffect } from 'react';

// The Konami Code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export function useKonamiCode() {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      // Get the key
      const key = e.key.toLowerCase();
      
      // Add the key to the sequence
      const updatedSequence = [...keySequence, e.key];
      
      // Only keep the last N keys (where N is the length of the Konami code)
      if (updatedSequence.length > KONAMI_CODE.length) {
        updatedSequence.shift();
      }
      
      setKeySequence(updatedSequence);
      
      // Check if the sequence matches the Konami code
      const isKonamiCode = updatedSequence.length === KONAMI_CODE.length &&
        updatedSequence.every((key, index) => 
          key.toLowerCase() === KONAMI_CODE[index].toLowerCase()
        );
      
      if (isKonamiCode) {
        setKonamiActivated(!konamiActivated);
      }
    };

    window.addEventListener('keydown', keyHandler);
    
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [keySequence]);
  
  return konamiActivated;
}