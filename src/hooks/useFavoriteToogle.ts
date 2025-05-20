import { useCallback, useContext } from 'react';
import { StoreContext } from '../store/StoreProvider';
import { IMarvelComic } from '../types/Comics';
import { toast } from 'react-toastify';
import { runInAction } from 'mobx';

export const useFavoriteToggle = () => {
    const { favoritesStore } = useContext(StoreContext);

    const toggleFavorite = useCallback((comic: IMarvelComic) => {
        try {
            if (favoritesStore.isFavorite(comic.id)) {
                favoritesStore.removeFromFavorites(comic.id);
            } else {
                favoritesStore.addToFavorites(comic);
            }
            // Принудительно вызываем обновление UI
            runInAction(() => {
                favoritesStore.favorites = [...favoritesStore.favorites];
            });
        } catch (error) {
            toast.error('Error updating favorites');
        }
    }, [favoritesStore]);

    return { toggleFavorite };
};