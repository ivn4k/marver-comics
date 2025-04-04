import React, { useState } from 'react';
import ComicCard from '../components/ComicCard';
import styles from './Comics.module.css';

interface ComicCardProps {
    id: number;
    title: string;
    thumbnail: string;
    isFavorite: boolean;
    toggleFavorite: () => void;
}

const Comics: React.FC = () => {
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

    
    const toggleFavorite = () => {}; // Pl
    

    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const currentComics = comics.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(comics.length / itemsPerPage);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h1 className={styles.title}>Comics ({comics.length})</h1>
            <div className={styles.divideLine}></div>
            <div className={styles.comicsContainer}>
                {currentComics.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        id={comic.id}
                        title={comic.title}
                        thumbnail={comic.thumbnail}
                        isFavorite={false}
                        toggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <div
                        key={index}
                        className={`${styles.pageDot} ${currentPage === index + 1 ? styles.active : ''}`}
                        onClick={() => handlePageClick(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comics;