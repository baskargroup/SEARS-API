import React from 'react';
import styles from './Header.module.css';

function Header({ onSignOut }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>SEARS API Access</h1>
        {onSignOut && (
          <button className={styles.signOutBtn} onClick={onSignOut}>Sign Out</button>
        )}
      </div>
    </header>
  );
}

export default Header;
