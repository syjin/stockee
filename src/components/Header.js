import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faUser } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import '../styles/Header.css';

function Header() {
  console.log('Header');
  return (
    <header>
      <a href='/' className='header__logo'>
        stockee
      </a>
      <div className='header__nav'>
        <a href='/cafe24-inventory' className='header__cafe24'>
          {/* <img src='/cafe24-logo-circle.png' alt='Cafe24 Inventory' /> */}
          <img src='/cafe24-logo.png' alt='Cafe24 Inventory' />
        </a>
        <a href='/shopify-inventory' className='header__shopify'>
          <img src='/shopify-logo.svg' alt='Shopify Invertory' />
        </a>
        <a href='/' className='header__settings'>
          <FontAwesomeIcon icon={faUser} className='fa-icon' />
        </a>
      </div>
    </header>
  );
}

export default Header;
