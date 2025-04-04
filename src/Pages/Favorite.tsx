import React from 'react';
import ComicCard from '../components/ComicCard';
import styles from './Comics.module.css';

const Favorite: React.FC = () => {
    const comics = [
        { id: 1, title: 'Avenges', thumbnail: 'src/assets/standard_incredible.jpg' },
        { id: 2, title: 'Spider-Man', thumbnail: 'src/assets/portrait_uncanny.jpg' },
        { id: 3, title: 'Captain America', thumbnail: 'src/assets/portrait_uncanny2.jpg' },
        { id: 4, title: 'Hulk', thumbnail: 'src/assets/portrait_uncanny3.jpg' },
        { id: 5, title: 'Avenges', thumbnail: 'src/assets/standard_incredible.jpg' },
        { id: 6, title: 'Spider-Man', thumbnail: 'src/assets/portrait_uncanny.jpg' },
        { id: 7, title: 'Captain America', thumbnail: 'src/assets/portrait_uncanny2.jpg' },
        { id: 8, title: 'Hulk', thumbnail: 'src/assets/portrait_uncanny3.jpg' },
    ];

    const favoriteComics = comics;  // Placeholder

    return (
        <div>
            <h1 className={styles.title}>Favorite Comics ({favoriteComics.length})</h1>
            <div className={styles.comicsContainer}>
                {favoriteComics.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        id={comic.id}
                        title={comic.title}
                        thumbnail={comic.thumbnail}
                        isFavorite={false} // Placeholder
                        toggleFavorite={() => {}} // Placeholder
                    />
                ))}
            </div>
        </div>
    );
};

export default Favorite;