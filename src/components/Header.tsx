import React from 'react';
import styles from './Header.module.css';
import logo from '../assets/Marvel_Logo.svg';
import HeaderButtons from './HeaderButtons';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="Marvel Comics Logo" className={styles.logo} />
            </div>
            <HeaderButtons />
        </header>
    );
};

export default Header;