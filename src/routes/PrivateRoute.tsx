import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const user = useAppSelector((state) => state.account.user);

  if (!user) {
    // ❌ Chưa đăng nhập → chuyển đến trang đăng nhập
    return <Navigate to="/signin" replace />;
  }

  // ✅ Đã đăng nhập → hiển thị trang
  return children;
}
