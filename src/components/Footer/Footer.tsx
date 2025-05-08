import styles from './Footer.module.css';
import logo from '../../assets/Marvel_Footer.svg';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <img src={logo} alt="Marvel Logo" className={styles.logo} />
                <p>Data provided by Marvel. © {currentYear} MARVEL</p>
                <p>
                    <a href="https://developer.marvel.com/" target="_blank" rel="noopener noreferrer">
                        developer.marvel.com/
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;