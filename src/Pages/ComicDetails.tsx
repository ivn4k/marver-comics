import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ComicDetails.module.css';

const ComicDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className={styles.container}>
            {/* Верхняя часть с миниатюрой и информацией */}
            <div className={styles.topSection}>
                <img
                    src="/src/assets/portrait_uncanny.jpg" 
                    alt="Thumbnail"
                    className={styles.thumbnail}
                />
                <div className={styles.info}>
                    <h1 className={styles.title}>Spider-Man</h1>
                    <div className={styles.links}>
                        <Link to="/comics/1" className={styles.link}>
                            Previous in Series
                        </Link>
                        <Link to="/comics/3" className={styles.link}>
                            Next in Series
                        </Link>
                    </div>
                </div>
            </div>

            {/* Раздел Variants */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Variants</h2>
                <div className={styles.comicsGrid}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className={styles.comicCard}>
                            <img
                                src="/src/assets/portrait_uncanny.jpg"
                                alt={`Variant ${index + 1}`}
                                className={styles.cardImage}
                            />
                            <p className={styles.cardTitle}>Variant {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Раздел Comics from the same series */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Comics from the same series</h2>
                <div className={styles.comicsGrid}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className={styles.comicCard}>
                            <img
                                src="/src/assets/portrait_uncanny.jpg"
                                alt={`Comic ${index + 1}`}
                                className={styles.cardImage}
                            />
                            <p className={styles.cardTitle}>Comic {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ComicDetails;