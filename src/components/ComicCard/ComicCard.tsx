import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ComicCard.module.css';
import heartEmpty from '../../assets/Vector_heart_1.svg';
import heartFilled from '../../assets/Vector_heart.svg';

interface ComicCardProps {
    id: number;
    title: string;
    thumbnail: string;
}

const ComicCard: React.FC<ComicCardProps> = ({ id, title, thumbnail }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleHeartClick = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <div className={styles.card}>
            <Link to={`/comics/${id}`}>
                <img src={thumbnail} alt={title} className={styles.image} />
                <h3 className={styles.title}>{title}</h3>
            </Link>
            <button className={styles.heartButton} onClick={handleHeartClick}>
                <img
                    src={isFavorite ? heartFilled : heartEmpty}
                    alt="Favorite"
                    className={styles.heartIcon}
                />
            </button>
        </div>
    );
};

export default ComicCard;