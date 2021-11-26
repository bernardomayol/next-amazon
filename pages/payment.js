import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import styles from './payment.module.scss';

const Payment = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state.cart;
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form className={styles.form} onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl>
              <RadioGroup
                aria-label='Payment Method'
                name='paymentMethod'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label='PayPal'
                  value='PayPal'
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label='Stripe'
                  value='Stripe'
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label='Cash'
                  value='Cash'
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth variant='contained' color='primary' type='submit'>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant='contained'
              type='button'
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
