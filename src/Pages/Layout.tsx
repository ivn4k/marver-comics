import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
    return (
        <div>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;