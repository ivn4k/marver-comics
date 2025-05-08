import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../../store/StoreProvider';
import ComicCard from '../../components/ComicCard/ComicCard';
import styles from './Favorite.module.css';

const Favorite: React.FC = observer(() => {
    const { favoritesStore } = useContext(StoreContext);

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>
                Favorite Comics ({favoritesStore.favoritesCount})
            </h1>
            <div className={styles.divideLine}></div>
            <div className={styles.comicsContainer}>
                {favoritesStore.favorites.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        id={comic.id}
                        title={comic.title}
                        thumbnail={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                        isFavorite={favoritesStore.isFavorite(comic.id)} 
                        onFavoriteClick={() => {
                            favoritesStore.removeFromFavorites(comic.id);
                        }}
                    />
                ))}
            </div>
        </div>
    );
});

export default Favorite;