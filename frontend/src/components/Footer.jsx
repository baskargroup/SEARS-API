import React from 'react';
import styles from './Footer.module.css';
import logo from '/home/ronak/Downloads/logo.png';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <img src={logo} alt="Iowa State University Logo" className={styles.logo} />
        <span className={styles.copyright}>
          &copy; Iowa State University of Science and Technology
        </span>
      </div>
    </footer>
  );
}

export default Footer;
