import React, { useEffect, useState } from "react";
import "./foodDescriptionStyles.css";
import { useParams } from "react-router-dom";
import demofood from "../../../demodata/demofood";
import { Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Navigation from "../../Navigation/Navigation";
import useMethods from "../../../StateProvider/useMethods";
import { useStateValue } from "../../../StateProvider/StateContext";

function FoodDescription() {
  const [state] = useStateValue();
  const { foodId } = useParams();
  const [food, setFood] = useState({});
  const { add_to_cart } = useMethods();
  useEffect(() => {
    demofood.map((food) => (food._id == foodId ? setFood(food) : null));
  }, []);
  return (
    <>
      <Navigation />

      <br />
      <br />
      <div className="food-description-page">
        <Typography gutterBottom variant="h3">
          {food.name}
        </Typography>
        <Grid spacing={3} container>
          <Grid item xs={12} md={6}>
            <div className="food-description-page-image-container">
              <img
                className="food-description-page-image"
                src={food.image}
                alt="food image"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" color="textSecondary">
              {food.description}
            </Typography>
          </Grid>
        </Grid>
        {state.user && state.token && (
          <div className="food-description-page-button">
            <Tooltip title="Add to food cart">
              <IconButton onClick={() => add_to_cart(food)}>
                <Add />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
}

export default FoodDescription;
