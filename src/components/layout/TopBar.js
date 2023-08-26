import classes from './TopBar.module.css';

function TopBar() {
    return(
        <nav className={classes['top-bar']}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    <a href='/'>STOCKEE</a>
                </div>
                <div className={classes['right-section']}>
                    <div className={classes.user}>
                        <a href='#'>Log in</a>
                    </div>
                    <a href='#'>
                        <button>Get Started</button>
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;