import React, { useEffect, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../../store/StoreProvider';
import ComicCard from '../../components/ComicCard/ComicCard';
import styles from './Comics.module.css';
import { useFavoriteToggle } from '../../hooks/useFavoriteToogle';
import { VirtuosoGrid } from 'react-virtuoso';
import { IMarvelComic } from '../../types/Comics';
import useDebounce from '../../hooks/useDebounce';


const Comics: React.FC = observer(() => {
    const { comicsStore, favoritesStore } = useContext(StoreContext);
    const { toggleFavorite } = useFavoriteToggle();
    
    // Состояние для хранения всех комиксов и управления загрузкой
    const [allComics, setAllComics] = useState<IMarvelComic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const itemsPerPage = 20;
    const debouncedSearchQuery = useDebounce(searchQuery, 2000);

    
    useEffect(() => {
        loadInitialComics();
    }, [debouncedSearchQuery]); 


    
    const loadInitialComics = async () => {
        setIsLoading(true);
        await comicsStore.fetchComics(0, itemsPerPage, debouncedSearchQuery);
        setAllComics(comicsStore.comics);
        setIsLoading(false);
        setHasMoreData(comicsStore.comics.length < comicsStore.totalComics);
    };

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMoreData) return;
        
        setIsLoading(true);
        const nextOffset = allComics.length;
        
        await comicsStore.fetchComics(nextOffset, itemsPerPage, debouncedSearchQuery);
        
        setAllComics(prevComics => [...prevComics, ...comicsStore.comics]);
        setIsLoading(false);
        setHasMoreData(allComics.length + comicsStore.comics.length < comicsStore.totalComics);
    }, [allComics.length, comicsStore, hasMoreData, isLoading, debouncedSearchQuery]);

    // Рендер элемента комикса для VirtuosoGrid
    const renderComicItem = useCallback((index: number) => {
        const comic = allComics[index];
        if (!comic) return null;
        
        return (
            <div className={styles.comicCardWrapper}>
                <ComicCard
                    id={comic.id}
                    title={comic.title}
                    thumbnail={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                    isFavorite={favoritesStore.isFavorite(comic.id)}
                    onFavoriteClick={() => {
                        toggleFavorite(comic);
                        setAllComics([...allComics]);
                    }}
                />
            </div>
        );
    }, [favoritesStore, toggleFavorite, allComics]); 

    // Footer компонент для Virtuoso
    // Отображает сообщение о загрузке или о том, что больше данных нет
    const Footer = useCallback(() => {
        return isLoading ? (
            <div className={styles.loadingFooter}>Loading more comics...</div>
        ) : !hasMoreData ? (
            <div className={styles.endMessage}>You've reached the end of the comics list</div>
        ) : null;
    }, [isLoading, hasMoreData]);

    if (comicsStore.error) {
        return <div className={styles.errorMessage}>{comicsStore.error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>Comics ({comicsStore.totalComics})</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search comics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>
            <div className={styles.divideLine}></div>
            {allComics.length === 0 && isLoading ? (
                <div className={styles.initialLoading}>Loading comics...</div>
            ) : (
                <div className={styles.virtuosoContainer}>
                    <VirtuosoGrid
                        style={{ 
                            height: 'calc(100vh - 250px)', 
                            width: '100%',
                            overflowX: 'hidden'
                        }}
                        data={allComics}
                        endReached={loadMore}
                        overscan={200}
                        itemContent={renderComicItem}
                        components={{
                            Footer,
                            List: (props) => <div {...props} className={styles.comicsContainer} />,
                            Item: (props) => <div {...props} className={styles.comicRow} />
                        }}
                        listClassName={styles.comicsContainer}
                    />
                </div>
            )}
        </div>
    );
});
export default Comics;