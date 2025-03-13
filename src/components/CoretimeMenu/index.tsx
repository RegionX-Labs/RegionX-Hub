import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './coretimeMenu.module.scss';
import DownArrow from '../../../public/DownArrow.svg';

const CoretimeMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavigation = (path: string) => {
    const fullPath = `/coretime/${path}`;
    router.push({
      pathname: fullPath,
      query: router.query,
    });
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <li className={styles.navItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      Coretime
      <Image src={DownArrow} alt='Down Arrow' className={styles.downArrow} />{' '}
      {isOpen && (
        <ul
          className={styles.subMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <li className={styles.subMenuItem} onClick={() => handleNavigation('my-regions')}>
            My Regions
          </li>
          <li className={styles.subMenuItem} onClick={() => handleNavigation('renew')}>
            Renew
          </li>
          <li className={styles.subMenuItem} onClick={() => handleNavigation('purchase')}>
            Purchase
          </li>
          <li className={styles.subMenuItem} onClick={() => handleNavigation('sale-history')}>
            Sale History
          </li>
        </ul>
      )}
    </li>
  );
};

export default CoretimeMenu;
