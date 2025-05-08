import { NavLink, useLocation } from 'react-router-dom';
import styles from './HeaderButtons.module.css';

const HeaderButtons: React.FC = () => {
    const location = useLocation();

    return (
        <div className={styles.buttonsContainer}>
            <NavLink
                to="/comics"
                className={`${styles.button} ${
                    location.pathname === '/comics' ? styles.active : ''
                }`}
            >
                Comics
            </NavLink>
            <NavLink
                to="/favorites"
                className={`${styles.button} ${
                    location.pathname === '/favorites' ? styles.active : ''
                }`}
            >
                Favorite
            </NavLink>
        </div>
    );
};

export default HeaderButtons;