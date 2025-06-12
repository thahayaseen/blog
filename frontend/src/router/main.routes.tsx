import { Route, Routes } from "react-router-dom";

// import Home from "../pages/Home";

// import CreateBlogForm from "../pages/CreateBlog";
// import BlogDetails from "../pages/BlogDetails";
// import MyBlogs from "../pages/MyBlogs";
import AuthForm from "../pages/authpage";
import ProtectedRoute, { PublicOnlyRoute } from "./protected.route";
import BlogDetails from "../pages/blogpage";
import CreateBlogForm from "../pages/createBlog";
import MyBlogs from "../pages/myblog";
import Home from "../pages/home";
import OTPVerification from "../pages/otp";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicOnlyRoute>
            <AuthForm />
          </PublicOnlyRoute>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route
        path="/create-blog"
        element={
          <ProtectedRoute>
            <CreateBlogForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-blogs"
        element={
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
