import { toast } from "react-toastify";
import type { IBlog } from "../interface/interface";
import api from "../lib/axios.interseptor";

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  return await api.post("/api/auth/signup", { name, email, password });
};

export const loginrequst = async (email: string, password: string) => {
  return await api.post("/api/auth/signin", { email, password });
};
export const getBlogByid = async (id: string) => {
  try {
    return await api.get("/api/blog/" + id);
  } catch (error) {
    throw new Error(error);
  }
};
export const fetchMyBlogs = async (page: number, limit: number) => {
  try {
    return await api.get("/api/blog/my-blogs?page=" + page + "&limit=" + limit);
  } catch (error) {
    console.log(error);

    throw new Error(error);
  }
};
export const getAllBlogs = async (page: number, limit: number) => {
  try {
    const ans = await api.get("/api/blog?page=" + page + "&limit=" + limit);
    return ans.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlogs = async (blogData: IBlog) => {
  try {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    if (blogData.imageFile) {
      formData.append("image", blogData.imageFile);
    }
    await api.post("/api/blog/update/" + blogData._id, blogData);
  } catch (error) {
    console.log(error);
  }
};
export const publishBlog = async (id: string) => {
  try {
    return await api.put("/api/blog/publish/" + id);
  } catch (error) {
    console.log(error);
  }
};
export const deleteBlog = async (id: string) => {
  try {
    await api.delete("/api/blog/" + id);
  } catch (error) {
    console.log(error);
  }
};
export const createBlog = async (data: FormData) => {
  try {
    const response = await api.post("/api/blog/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    for (let i in error.details) {
      console.log(i);
      toast.error(`${i} : ${error.details[i]}`);
    }

    throw new Error(error?.response?.data?.msg);
  }
};
export const fetchUserDrafts = async (page: number, limit: number) => {
  try {
    return await api.get(
      "/api/blog/my-blogs?page=" + page + "&limit=" + limit + "&drafted=true"
    );
  } catch (error) {
    console.log(error);

    throw new Error(error);
  }
};
export const sendOTPVerification = async (userid: string, otp: string) => {
  const dat = await api.post("/api/auth/otp", { userid, otp });
  return dat.data;
};
