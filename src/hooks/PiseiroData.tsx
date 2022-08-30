import React, { useState, createContext, useMemo } from 'react';
import { Cast } from '../types';

export interface IPiseiroData {
  cuts: Cast[];
  rooms: Cast[];
  setCuts: React.Dispatch<React.SetStateAction<Cast[]>>;
  setRooms: React.Dispatch<React.SetStateAction<Cast[]>>;
}

export const piseiroDataInitialValue: IPiseiroData = {
  cuts: [],
  rooms: [],
  setCuts: () => true,
  setRooms: () => true,
};

export const PiseiroDataContext = createContext<IPiseiroData>(
  piseiroDataInitialValue
);

export const PiseiroDataContextProvider: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [cuts, setCuts] = useState<Cast[]>([]);
  const [rooms, setRooms] = useState<Cast[]>([]);

  const providerValue = useMemo(
    () => ({
      cuts,
      rooms,
      setCuts,
      setRooms,
    }),
    [cuts, rooms, setCuts, setRooms]
  );

  return (
    <PiseiroDataContext.Provider value={providerValue}>
      {children}
    </PiseiroDataContext.Provider>
  );
};

export default PiseiroDataContext;
