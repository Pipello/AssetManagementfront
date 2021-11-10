import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';


import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";


import { useDidMount, API_URL } from "./utils"

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    buttonTop: {
        marginTop: theme.spacing(3),
    },
    colorProfit: {
        color: green[600],
    },
    colorDeficit: {
        color: red[600],
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      marginTop: theme.spacing(4),
      width:420,
      maxWidth: 500,
    },
    image: {
      width: 128,
      height: 128,
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default function Home() {
    const didMount = useDidMount();
    const classes = useStyles();
    const [bags, setBags] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [tax, setTax] = React.useState(0);
    
    const fetchBags = async () => {
        const response = await fetch(API_URL + 'bags');
        const data = await response.json();
        setBags(data);
    }

    const fetchTaxes = async () => {
        const response = await fetch(API_URL + 'taxes');
        const data = await response.json()
        setTax(data["tax"]);
        setOpen(true);
    }

    useEffect(() => {
        if(didMount) {
            fetchBags();
        }
    }, [didMount]);

    return (

        <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        >
            <Grid 
            item 
            xs={12}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            >
                <Button className={classes.buttonTop} onClick={fetchTaxes} variant="contained" color="primary">
                    Get taxes
                </Button>
            </Grid>
            <Grid item xs={8} container>
                {bags.map(bag => (
                <Paper key={bag.id} className={classes.paper} elevation={3} component={Link} to={"/bags/" + bag.id} style={{ textDecoration: 'none', color: 'inherit'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h4" component="h4" color="primary">
                                        {capitalize(bag.asset)}
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        1 {bag.symbol?bag.symbol:"NaN"} = {bag.actual_price.toFixed(2)} EUR
                                    </Typography>
                                    <br/>
                                    <Typography variant="h5" gutterBottom>
                                        Total: {(bag.actual_price*bag.amount).toFixed(2)} EUR
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Holding: {bag.amount} {bag.symbol} 
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Average buy price: {bag.average_buy_price.toFixed(2)} EUR
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Gain: <span className={bag.global_earning>=0?classes.colorProfit:classes.colorDeficit}>{bag.global_earning.toFixed(2)} EUR</span>
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                       Unrealized gain: <span className={(bag.amount * (bag.actual_price - bag.average_buy_price)).toFixed(2)>=0?classes.colorProfit:classes.colorDeficit}>
                                                            {(bag.amount * (bag.actual_price - bag.average_buy_price)).toFixed(2)} EUR
                                                        </span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                ))}
            </Grid>
            <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className={classes.modal}  
            >
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom color="primary">Taxes</Typography>
                    <Typography variant="h6">Total: {tax} EUR</Typography>
                    <br/>
                    <Typography variant="subtitle1" component="p">Details:</Typography>
                    {bags.map(bag => (
                        <Typography key={bag.id} variant="subtitle1" component="p">{bag.symbol}: {bag.bag_tax} EUR</Typography>
                    ))}
                </Paper>
            </Modal>
        </Grid>
    );
}