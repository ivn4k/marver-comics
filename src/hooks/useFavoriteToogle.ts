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
                toast.success(`${comic.title} removed from favorites`);
            } else {
                favoritesStore.addToFavorites(comic);
                toast.success(`${comic.title} added to favorites`);
            }
        } catch (error) {
            toast.error('Error updating favorites');
        }
    }, [favoritesStore]);

    return { toggleFavorite };
};