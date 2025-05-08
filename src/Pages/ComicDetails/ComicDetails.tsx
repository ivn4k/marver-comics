import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../../store/StoreProvider';
import styles from './ComicDetails.module.css';
import ComicCard from '../../components/ComicCard/ComicCard';
import { useFavoriteToggle } from '../../hooks/useFavoriteToogle';

const ComicDetails: React.FC = observer(() => {
    const { comicsStore, favoritesStore } = useContext(StoreContext);
    const { toggleFavorite } = useFavoriteToggle();
    const { id } = useParams<{ id: string }>();
    const currentId = parseInt(id || '0');

    useEffect(() => {
        comicsStore.fetchComicById(currentId);
    }, [currentId, comicsStore]);

    if (comicsStore.loading) {
        return <div>Loading...</div>;
    }

    if (!comicsStore.currentComic) {
        return <div>Comic not found</div>;
    }

    const currentComic = comicsStore.currentComic;
    const nextIssueId = comicsStore.getNextInSeries();
    const previousIssueId = comicsStore.getPreviousInSeries();

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <img
                    src={`${currentComic.thumbnail.path}.${currentComic.thumbnail.extension}`}
                    alt={currentComic.title}
                    className={styles.thumbnail}
                />
                <div className={styles.info}>
                    <h1 className={styles.title}>{currentComic.title}</h1>
                    <p className={styles.series}>Series: {currentComic.series.name}</p>
                    <p className={styles.description}>
                        {currentComic.description || 'No description available'}
                    </p>
                    
                    <div className={styles.links}>
                        {previousIssueId && (
                            <Link 
                                to={`/comics/${previousIssueId}`} 
                                className={styles.link}
                            >
                                Previous Issue
                            </Link>
                        )}
                        {nextIssueId && (
                            <Link 
                                to={`/comics/${nextIssueId}`} 
                                className={styles.link}
                            >
                                Next Issue
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Variants section */}
            {comicsStore.variants.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Cover Variants for Issue #{currentComic.issueNumber}
                    </h2>
                    <div className={styles.comicsGrid}>
                        {comicsStore.variants.map(variant => (
                            <ComicCard
                                key={variant.id}
                                id={variant.id}
                                title={variant.title}
                                thumbnail={`${variant.thumbnail.path}.${variant.thumbnail.extension}`}
                                isFavorite={favoritesStore.isFavorite(variant.id)}
                                onFavoriteClick={() => toggleFavorite(variant)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Series section */}
            {comicsStore.seriesComics.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        More From {currentComic.series.name}
                    </h2>
                    <div className={styles.comicsGrid}>
                        {comicsStore.seriesComics.map(comic => (
                            <ComicCard
                                key={comic.id}
                                id={comic.id}
                                title={comic.title}
                                thumbnail={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                isFavorite={favoritesStore.isFavorite(comic.id)}
                                onFavoriteClick={() => toggleFavorite(comic)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default ComicDetails;