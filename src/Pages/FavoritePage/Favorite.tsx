import React from 'react';
import ComicCard from '../../components/ComicCard/ComicCard';
import styles from '../ComicsPage/Comics.module.css';
import comics from '../../placeholders/ComicsPlaceholders';

const Favorite: React.FC = () => {

    const favoriteComics = comics;  // Placeholder

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Favorite Comics ({favoriteComics.length})</h1>
            <div className={styles.divideLine}></div>
            <div className={styles.comicsContainer}>
                {favoriteComics.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        id={comic.id}
                        title={comic.title}
                        thumbnail={comic.thumbnail}
                    />
                ))}
            </div>
        </div>
    );
};

export default Favorite;