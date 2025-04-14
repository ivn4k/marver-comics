import React, { createContext } from 'react';
import { comicsStore } from './ComicsStore';
import { favoritesStore } from './FavoritesStore';

interface IStoreContext {
    comicsStore: typeof comicsStore;
    favoritesStore: typeof favoritesStore;
}

export const StoreContext = createContext<IStoreContext>({ 
    comicsStore,
    favoritesStore 
});

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <StoreContext.Provider value={{ comicsStore, favoritesStore }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;