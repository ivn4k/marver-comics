import React, { useState } from 'react';
import ComicCard from '../../components/ComicCard/ComicCard';
import styles from './Comics.module.css';
import { Outlet, useParams } from 'react-router-dom';
import comics from '../../placeholders/ComicsPlaceholders';


const Comics: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (id) {
        return <Outlet />;
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const currentComics = comics.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(comics.length / itemsPerPage);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Comics ({comics.length})</h1>
            <div className={styles.divideLine}></div>
            <div className={styles.comicsContainer}>
                {currentComics.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        id={comic.id}
                        title={comic.title}
                        thumbnail={comic.thumbnail}
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