import "./App.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import AppRouter from "./routes/AppRouter";
import { fetchAccount } from "./redux/slice/accountSlide";
function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.account.isLoading);

  useEffect(() => {
    if (
      window.location.pathname === "/signin" ||
      window.location.pathname === "/signup"
    )
      return;
    dispatch(fetchAccount());
  }, []);
  return (
    <>
      <AppRouter></AppRouter>
    </>
  );
}

export default App;
