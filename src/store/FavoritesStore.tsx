import { makeAutoObservable, reaction } from 'mobx';

import { IMarvelComic } from '../types/Comics';

class FavoritesStore {
    favorites: IMarvelComic[] = [];

    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();

        // Реакция на изменения в favorites
        reaction(
            () => this.favorites.slice(), // Наблюдаем за изменениями массива
            (favorites) => {
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        );
    }

    private loadFromLocalStorage() {
        const stored = localStorage.getItem('favorites');
        if (stored) {
            this.favorites = JSON.parse(stored);
        }
    }

    addToFavorites(comic: IMarvelComic) {
        if (!this.isFavorite(comic.id)) {
            this.favorites.push(comic);
        }
    }

    removeFromFavorites(comicId: number) {
        this.favorites = this.favorites.filter(comic => comic.id !== comicId);
    }

    isFavorite(comicId: number): boolean {
        return this.favorites.some(comic => comic.id === comicId);
    }

    get favoritesCount(): number {
        return this.favorites.length;
    }
}

export const favoritesStore = new FavoritesStore();