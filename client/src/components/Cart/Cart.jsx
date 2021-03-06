import {
  Button,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { DeleteForeverOutlined } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../../StateProvider/StateContext";
import useMethods from "../../StateProvider/useMethods";
import Navigation from "../Navigation/Navigation";
import "./cartStyles.css";
function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const [state] = useStateValue();
  const { change_quantity, remove_cart } = useMethods();
  useEffect(() => {
    if (state.carts.length < 1) return navigate("/");
  });

  return (
    <>
      <Navigation />
      <br />
      <br />
      <div className="cart-container">
        <Grid spacing={4} container>
          {state.carts.map((cart, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <div className="cart">
                <Typography align="center" variant="h6">
                  {cart.name}
                </Typography>
                <CardMedia image={cart.image} className="cart-image" />

                <div className="cart-actions">
                  <div className="cart-actions-left">
                    <IconButton
                      onClick={() =>
                        change_quantity(cart.quantity + 1, cart, index)
                      }
                      className="cart-action-button"
                    >
                      +
                    </IconButton>
                    <Typography variant="body1" color="primary">
                      {cart.quantity}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        change_quantity(cart.quantity - 1, cart, index)
                      }
                      className="cart-action-button"
                    >
                      -
                    </IconButton>
                  </div>
                  <IconButton onClick={() => remove_cart(cart._id)}>
                    <DeleteForeverOutlined />
                  </IconButton>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        <div className="cart-page-footer">
          <Button size="large" variant="contained" color="primary">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/create-order"
            >
              Make Order?
            </Link>
          </Button>
          <Button size="large" variant="outlined" color="secondary">
            Empty Cart?!
          </Button>
        </div>
      </div>
    </>
  );
}

export default Cart;
