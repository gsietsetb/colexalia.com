import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce a un valor.
 * Espera a que el usuario deje de escribir antes de actualizar el valor,
 * lo que ayuda a reducir la cantidad de peticiones a la API.
 *
 * @param value El valor que queremos hacer debounce
 * @param delay El tiempo en milisegundos a esperar antes de actualizar
 * @returns El valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar un temporizador para actualizar el valor con debounce
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes de que termine el delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 