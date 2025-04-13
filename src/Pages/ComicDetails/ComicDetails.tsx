import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './ComicDetails.module.css';
import comics from '../../placeholders/ComicsPlaceholders';
import ComicCard from '../../components/ComicCard/ComicCard';

const ComicDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const currentId = parseInt(id || '0');
    
    const currentComic = comics.find(comic => comic.id === currentId);
    
    const currentIndex = comics.findIndex(comic => comic.id === currentId);
    
    const prevComic = currentIndex > 0 ? comics[currentIndex - 1] : null;
    const nextComic = currentIndex < comics.length - 1 ? comics[currentIndex + 1] : null;

    if (!currentComic) {
        return <div>Comic not found</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <img
                    src={currentComic.thumbnail}
                    alt={currentComic.title}
                    className={styles.thumbnail}
                />
                <div className={styles.info}>
                    <h1 className={styles.title}>{currentComic.title}</h1>
                    <div className={styles.links}>
                        {prevComic && (
                            <Link to={`/comics/${prevComic.id}`} className={styles.link}>
                                Previous in Series
                            </Link>
                        )}
                        {nextComic && (
                            <Link to={`/comics/${nextComic.id}`} className={styles.link}>
                                Next in Series
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.variant}>
                <h2 className={styles.variantTitle}>Variants</h2>
                <div className={styles.comicsGrid}>
                    {comics
                        .filter(comic => comic.id !== currentId)
                        .slice(0, 4)
                        .map(comic => (
                            <ComicCard
                                key={comic.id}
                                id={comic.id}
                                title={comic.title}
                                thumbnail={comic.thumbnail}
                            />
                        ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Related Comics</h2>
                <div className={styles.comicsGrid}>
                    {comics
                        .filter(comic => comic.id !== currentId)
                        .slice(0, 4)
                        .map(comic => (
                            <ComicCard
                                key={comic.id}
                                id={comic.id}
                                title={comic.title}
                                thumbnail={comic.thumbnail}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ComicDetails;