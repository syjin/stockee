import Card from '../components/UI/Card';
import classes from './Products.module.css';

function Products() {
    return (
        <div className='container'>
            <div className={classes.products}>
                <h2>Products</h2>
                <Card>
                    <div className={classes.filters}>
                        <div className={classes.search}>
                            {/* <label for='search'>Searching all inventory</label> */}
                            <input type='text' placeholder='Searching all inventory'></input>
                        </div>
                    </div>
                    <table className={classes.table}>
                        <thead>
                            <tr className='row'>
                                <th className='col-1'></th>
                                <th className='col-3'>Products</th>
                                <th className='col-2'>SKU</th>
                                <th className='col-2'>Variants</th>
                                <th className='col-2'>CAFE24</th>
                                <th className='col-2'>Shopify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='row'>
                                <td className={`${classes.number} col-1`}>
                                    <div>1</div>
                                </td>
                                <td className={`${classes.title} col-3`}>
                                    <div>2</div>
                                </td>
                                <td className={`${classes.sku} col-2`}>3</td>
                                <td className={`${classes.variants} col-2`}>4</td>
                                <td className={`${classes.cafe24} col-2`}>5</td>
                                <td className={`${classes.shopify} col-2`}>6</td>
                            </tr>
                            <tr className='row'>
                                <td className={`${classes.number} col-1`}>
                                    <div>1</div>
                                </td>
                                <td className={`${classes.title} col-3`}>
                                    <div>2</div>
                                </td>
                                <td className={`${classes.sku} col-2`}>3</td>
                                <td className={`${classes.variants} col-2`}>4</td>
                                <td className={`${classes.cafe24} col-2`}>5</td>
                                <td className={`${classes.shopify} col-2`}>6</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}

export default Products;