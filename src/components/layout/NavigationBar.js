import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './NavigationBar.module.css';

function NavigationBar() {
    return (
        <div className={classes['nav-bar']}>
            <div className={classes.list}>
                <a href='/'><FontAwesomeIcon icon='fa-solid fa-house' className={classes.icon} />Home</a>
            </div>
            <div className={classes.list}>
                <a href='/products'><FontAwesomeIcon icon='fa-solid fa-tags' className={classes.icon} />Products</a>
            </div>
            <div className={classes.list}>
                <a href='/settings'><FontAwesomeIcon icon='fa-solid fa-gear' className={classes.icon} />Settings</a>
            </div>
        </div>
    ); 
}

export default NavigationBar;