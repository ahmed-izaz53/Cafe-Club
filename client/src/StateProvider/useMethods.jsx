import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "./StateContext";

function useMethods() {
  const auth_base_url = "http://localhost:8000/auth";
  const cart_base_url = "http://localhost:8000/cart";
  const category_base_url = "http://localhost:8000/category";
  const [state, dispatch] = useStateValue();
  const navigate = useNavigate();
  ////======================================
  ////======================================
  const login = ({ email, password }) => {
    axios
      .post(`${auth_base_url}/login`, { email, password })
      .then((response) => {
        if (!response.data.user || !response.data.token)
          return alert("Password doesn't match!");
        const { user, token, carts, orders } = response.data;
        dispatch({ type: "ADD_USER", user });
        dispatch({ type: "ADD_TOKEN", token });
        dispatch({ type: "ADD_CARTS", carts });
        dispatch({ type: "ADD_ORDERS", orders });
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
        return navigate("/");
      })
      .catch(() => {
        return alert("Password doesn't match!");
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
    dispatch({ type: "DELETE_EVERYTHING" });
    sessionStorage.clear();
    return navigate("/");
  };
  ////======================================
  ////======================================
  const get_category_list = () => {
    axios
      .get(`${category_base_url}/category-list`)
      .then((response) => {
        if (response.status !== 200) return alert(response.data.error);
        dispatch({
          type: "ADD_CATEGORIES",
          categories: response.data.categories,
        });
        return;
      })
      .catch((error) => alert(error.message));
  };
  ////======================================
  ////======================================
  const get_carts_and_orders = (user, token) => {
    axios
      .post(`${auth_base_url}/get-carts-and-orders`, { token })
      .then((response) => {
        if (response.status !== 200) return alert(response.data.error);
        dispatch({ type: "ADD_TOKEN", token });
        dispatch({ type: "ADD_USER", user: JSON.parse(user) });
        dispatch({ type: "ADD_CARTS", carts: response.data.carts });
        dispatch({ type: "ADD_ORDERS", orders: response.data.orders });
        return navigate(-1);
      })
      .catch((error) => alert(error));
  };
  ////======================================
  ////======================================
  const add_to_cart = async (food_id) => {
    const cart_exist = state.carts.filter((cart) => cart.food_id == food_id);
    if (cart_exist.length > 0) return alert("cart already added!");
    const { data } = await axios.post(`${cart_base_url}/create-cart`, {
      food_id,
      token: state.token,
    });
    if (!data.cart) return alert("can't add to cart! please try again letter!");
    dispatch({ type: "ADD_TO_CARTS", cart: data.cart });
    return;
  };
  ////======================================
  ////======================================
  const change_quantity = (value, cart, index) => {
    if (value < 1) return;
    const carts = state.carts;
    axios
      .post(`${cart_base_url}/change-quantity`, {
        value,
        cart_id: cart._id,
        token: state.token,
      })
      .then(({ data }) => {
        if (!data.cart_updated)
          return alert("Cart quantity doesn't update!Please try again!");
        carts[index].quantity = value;
        dispatch({
          type: "CHANGE_CART_QUANTITY",
          carts,
        });
        return;
      })
      .catch((error) => alert(error));
  };
  ////======================================
  ////======================================
  const remove_cart = (cart_id) => {
    axios
      .post(`${cart_base_url}/remove-cart`, { cart_id, token: state.token })
      .then((response) => {
        if (response.status !== 200)
          return alert("Cart  doesn't deleted ! Please try again!");
        const carts = state.carts.filter((cart) => cart._id != cart_id);
        return dispatch({ type: "REMOVE_FROM_CARTS", carts });
      })
      .catch((error) => alert(error.message));
  };
  ////======================================
  ////======================================
  const delete_user_carts = () => {
    axios
      .post(`${cart_base_url}/delete-user-carts`, {
        token: state.token,
      })
      .then((response) => {
        if (response.status == 200) return navigate("/");
        return alert("Can't delete carts.. Please try again letter!");
      })
      .catch();
  };
  ////======================================
  ////======================================

  const confirm_order = (dateTime) => {
    console.log(dateTime);
  };

  ////======================================
  ////======================================
  return {
    get_carts_and_orders,
    get_category_list,
    login,
    signup,
    logout,
    add_to_cart,
    change_quantity,
    remove_cart,
    delete_user_carts,
    confirm_order,
  };
}

export default useMethods;
