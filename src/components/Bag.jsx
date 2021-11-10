import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import moment from 'moment';

import { useDidMount, API_URL } from "./utils";

import { makeStyles, withStyles} from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import { capitalize } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import FormControl  from "@material-ui/core/FormControl";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';



const useStyles = makeStyles((theme) => ({
    form_root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '80%',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'column',
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(1),
      },

    paper: {
        position: "absolute",
        top: "28%", 
        width: 300,
        paddingTop:theme.spacing(2),
        boxShadow: theme.shadows[5],
    },

    radio_group: {
        justifyContent: 'center',
    },

    addOrderButton: {
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(3),
    },

    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  const RedRadio = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

export default function Bag() {
    const didMount = useDidMount();
    const classes = useStyles();
    const { id } = useParams();
    const [bag, setBag] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [order_type, setOrderType] = React.useState('BUY');
    const [price, setPrice] = React.useState(0);
    const [amount, setAmount] = React.useState(0);
    const [status, setStatus] = React.useState(0);

    const handleOrderSubmit = (event) => {
        event.preventDefault();
        const data = {
            amount: amount,
            price: price,
            order_type: order_type,
            bag: bag["id"],
        }
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
        fetch(API_URL + 'orders/', requestOptions).then(response => setStatus(response["status"])).then(handleCloseModal());
        event.target.reset();
    }

    const handleOrderDelete = (id) => {
        fetch(API_URL + 'orders/' + id, {method: 'DELETE'}).then(response => setStatus(response["status"]));
    }

    const handleOpenModal = () => {
        setOpen(true);
    }

    const handleCloseModal = () => {
        setOpen(false);
    }

    const fetchBag = async (id) => {
        const response = await fetch(API_URL + 'bags/' + id);
        const data = await response.json();
        setBag(data);
    }

    useEffect(() => {
        if(didMount || status === 201 || status === 204) {
            setStatus(0)
            fetchBag(id);
        }
    }, [didMount, id, bag, status]);

    return (
        <div>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >

                <Grid className={classes.addOrderButton} item xs={9}>
                    <Button color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>Add Order</Button> 
                </Grid>
                <Grid item xs={9} container>
                    <TableContainer component={Paper}>
                        <Table aria-label="bag table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Price (EUR)</TableCell>
                                    <TableCell align="right">Earnings</TableCell>
                                    <TableCell align="center">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(bag).length === 0?<tr></tr>:bag.orders_list.map((order) =>(
                                    <TableRow key={order.id}>
                                        <TableCell component="th" scope="row">{moment(order.date).format("DD MMM. YYYY HH:mm")}</TableCell>
                                        <TableCell align="right">{order.order_type}</TableCell>
                                        <TableCell align="right">{order.amount}</TableCell>
                                        <TableCell align="right">{order.price}</TableCell>
                                        <TableCell align="right">{order.earnings}</TableCell>
                                        <TableCell align="center"><Button onClick={() => handleOrderDelete(order.id)} color="secondary" startIcon={<DeleteIcon />}>Delete</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.modal}                 
            >
               <Paper className={classes.paper}>
                    <Typography variant="h5" color="primary" align="center">
                        {Object.keys(bag).length === 0?"":capitalize(bag.asset)}
                    </Typography>
                   <form className={classes.form_root} autoComplete="off" onSubmit={handleOrderSubmit}>
                        <TextField id="order-amount" label="Amount" onChange={(e) => setAmount(parseFloat(e.target.value))}/>
                        <TextField id="order-price" label="Price" onChange={(e) => setPrice(parseFloat(e.target.value))}/>
                        <FormControl component="fieldset">
                            <RadioGroup className={classes.radio_group} row aria-label="order_type" name="order_type1" value={order_type} onChange={(e) => setOrderType(e.target.value)}>
                                <FormControlLabel value="BUY" control={<GreenRadio />} label="BUY" />
                                <FormControlLabel value="SELL" control={<RedRadio />} label="SELL" />
                            </RadioGroup>
                        </FormControl>
                        <Button variant="contained" type="submit" color="primary">
                            Add Order
                        </Button>
                   </form>
                </Paper>
            </Modal>
        </div>
    );
}