import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "./StateContext";

function useMethods() {
  const auth_base_url = "http://localhost:8000/auth";
  const [state, dispatch] = useStateValue();
  const navigate = useNavigate();
  ////======================================
  ////======================================
  const login = ({ email, password }) => {
    axios
      .post(`${auth_base_url}/login`, { email, password })
      .then((response) => {
        if (!response.data.user || !response.data.token)
          return alert(response.data?.message || response.data?.error);
        const { user, token } = response.data;
        dispatch({ type: "ADD_USER", user });
        dispatch({ type: "ADD_TOKEN", token });
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
        return navigate("/");
      })
      .catch((error) => {
        return alert(error);
      });
  };
  ////======================================
  ////======================================
  const signup = (data) => {
    axios
      .post(`${auth_base_url}/signup`, { ...data })
      .then((response) => {
        if (response.data.status !== 200)
          return alert(response.data?.message || response.data?.error);
        alert(response.data.message);
        return navigate("/login");
      })
      .catch((error) => alert(error));
  };
  ////======================================
  ////======================================
  const logout = () => {
    dispatch({ type: "REMOVE_USER" });
    dispatch({ type: "REMOVE_TOKEN" });
    return sessionStorage.clear();
  };
  ////======================================
  ////======================================
  const add_to_cart = (food) => {
    if (state.carts.filter((cart) => cart._id == food._id).length > 0)
      return alert("Food is already exist in your food cart!");
    food.quantity = 1;
    return dispatch({ type: "ADD_TO_CARTS", food });
  };
  ////======================================
  ////======================================
  return { login, signup, logout, add_to_cart };
}

export default useMethods;
