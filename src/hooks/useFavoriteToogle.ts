import { useCallback, useContext } from 'react';
import { StoreContext } from '../store/StoreProvider';
import { IMarvelComic } from '../types/Comics';
import { toast } from 'react-toastify';

export const useFavoriteToggle = () => {
    const { favoritesStore } = useContext(StoreContext);

    const toggleFavorite = useCallback((comic: IMarvelComic) => {
        try {
            if (favoritesStore.isFavorite(comic.id)) {
                favoritesStore.removeFromFavorites(comic.id);
            } else {
                favoritesStore.addToFavorites(comic);
            }
        } catch {
            toast.error('Error updating favorites');
        }
    }, [favoritesStore]);

    return { toggleFavorite };
};