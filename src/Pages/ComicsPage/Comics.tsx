import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../../store/StoreProvider';
import ComicCard from '../../components/ComicCard/ComicCard';
import styles from './Comics.module.css';
import { Outlet, useParams, useSearchParams, useNavigate } from 'react-router-dom';

const Comics: React.FC = observer(() => {
    const { comicsStore, favoritesStore } = useContext(StoreContext);
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const itemsPerPage = 20;
    const currentPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const offset = (currentPage - 1) * itemsPerPage;
        comicsStore.fetchComics(offset, itemsPerPage);
    }, [currentPage, comicsStore, itemsPerPage]);

    if (id) {
        return <Outlet />;
    }

    if (comicsStore.loading) {
        return <div>Loading...</div>;
    }

    if (comicsStore.error) {
        return <div>{comicsStore.error}</div>;
    }

    const handlePageClick = (page: number) => {
        navigate(`?page=${page}`);
    };

    const renderPaginationItems = () => {
        const items = [];
        const totalPages = Math.ceil(comicsStore.totalComics / itemsPerPage);

        if (currentPage > 3) {
            items.push(
                <div
                    key={1}
                    className={`${styles.pageDot}`}
                    onClick={() => handlePageClick(1)}
                >
                    1
                </div>
            );
            items.push(<span key="leftDots" className={styles.dots}>...</span>);
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <div
                    key={i}
                    className={`${styles.pageDot} ${currentPage === i ? styles.active : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </div>
            );
        }

        if (currentPage < totalPages - 2) {
            items.push(<span key="rightDots" className={styles.dots}>...</span>);
            items.push(
                <div
                    key={totalPages}
                    className={`${styles.pageDot}`}
                    onClick={() => handlePageClick(totalPages)}
                >
                    {totalPages}
                </div>
            );
        }

        return items;
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Comics ({comicsStore.totalComics})</h1>
            <div className={styles.divideLine}></div>
            <div className={styles.comicsContainer}>
                {comicsStore.comics.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        id={comic.id}
                        title={comic.title}
                        thumbnail={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                        isFavorite={favoritesStore.isFavorite(comic.id)}
                        onFavoriteClick={() => {
                            if (favoritesStore.isFavorite(comic.id)) {
                                favoritesStore.removeFromFavorites(comic.id);
                            } else {
                                favoritesStore.addToFavorites(comic);
                            }
                        }}
                    />
                ))}
            </div>
            <div className={styles.pagination}>
                {renderPaginationItems()}
            </div>
        </div>
    );
});

export default Comics;