import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './ComicCard.module.css';
import heartEmpty from '../../assets/Vector_heart_1.svg';
import heartFilled from '../../assets/Vector_heart.svg';

interface ComicCardProps {
    id: number;
    title: string;
    thumbnail: string;
    isFavorite: boolean;
    onFavoriteClick: () => void;
}

const ComicCard: React.FC<ComicCardProps> = observer(({ 
    id, 
    title, 
    thumbnail, 
    isFavorite, 
    onFavoriteClick 
}) => {
    return (
        <div className={styles.card}>
            <Link to={`/comics/${id}`}>
                <img src={thumbnail} alt={title} className={styles.image} />
                <h3 className={styles.title}>{title}</h3>
            </Link>
            <button 
                className={styles.heartButton} 
                onClick={(e) => {
                    e.preventDefault();
                    onFavoriteClick();
                }}
            >
                <img
                    src={isFavorite ? heartFilled : heartEmpty}
                    alt="Favorite"
                    className={styles.heartIcon}
                />
            </button>
        </div>
    );
});

export default ComicCard;