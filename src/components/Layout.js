import { Outlet } from 'react-router-dom';
import '../styles/Layout.css';
import Header from './Header';

function Layout() {
  console.log('Layout');
  return (
    <div className='layout'>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
