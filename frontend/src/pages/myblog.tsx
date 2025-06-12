import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../contexts/auth.contexts";
// import {

//   updateBlog,
//   deleteBlog,
//   fetchUserDrafts,
// } from
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { IBlog } from "../interface/interface";
import BlogCard from "../components/BlogCard";
import EditBlogModal from "../components/EditBlog";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiLogOut,
  FiEye,
  FiSearch,
  FiGrid,
  FiList,
} from "react-icons/fi";
import LoadingSpinner from "../components/Loader";
import ConfirmationModal from "../components/Confirmation";
import {
  deleteBlog,
  fetchMyBlogs,
  fetchUserDrafts,
  updateBlogs,
} from "../service/authservice";

interface BlogResponse {
  blogs: IBlog[];
  total: number;
  page: number;
  totalPages: number;
}

type BlogTab = "published" | "drafts";
type ViewMode = "grid" | "list";

const MyBlogs: React.FC = () => {
  const { user, logout } = useAuth();
  const [publishedBlogs, setPublishedBlogs] = useState<IBlog[]>([]);
  const [draftBlogs, setDraftBlogs] = useState<IBlog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);
  const [activeTab, setActiveTab] = useState<BlogTab>("published");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreDrafts, setHasMoreDrafts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingBlogId, setEditingBlog] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Filter blogs based on search query
  useEffect(() => {
    const currentBlogs =
      activeTab === "published" ? publishedBlogs : draftBlogs;
    if (searchQuery.trim() === "") {
      setFilteredBlogs(currentBlogs);
    } else {
      const filtered = currentBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, publishedBlogs, draftBlogs, activeTab]);

  const fetchBlogs = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      try {
        const response = await fetchMyBlogs(pageNum, 5);
        console.log(response, "resp is ");

        setPublishedBlogs((prev) => {
          const newBlogs = (response?.data as BlogResponse).blogs.filter(
            (newBlog) => !prev.some((blog) => blog._id === newBlog._id)
          );
          return [...prev, ...newBlogs];
        });

        setHasMore(pageNum < response.total);
        setPage(pageNum + 1);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch your blogs");
      } finally {
        setIsLoading(false);
        setInitialLoading(false);
      }
    },
    [isLoading, hasMore]
  );

  const fetchDrafts = useCallback(
    async (pageNum: number) => {
      if (isLoadingDrafts || !hasMoreDrafts) return;
      setIsLoadingDrafts(true);

      try {
        const response: BlogResponse = await fetchUserDrafts(pageNum, 5);
        console.log(response,'ress');

        setDraftBlogs((prev) => {
          const newBlogs = response.data.blogs.filter(
            (newBlog) => !prev.some((blog) => blog._id === newBlog._id)
          );
          return [...prev, ...newBlogs];
        });

        setHasMoreDrafts(pageNum < response.totalPages);
        setDraftPage(pageNum + 1);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch your drafts");
      } finally {
        setIsLoadingDrafts(false);
      }
    },
    [isLoadingDrafts, hasMoreDrafts]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please login to view your blogs");
      return;
    }
    fetchBlogs(1);
    fetchDrafts(1);
  }, [user, navigate, fetchBlogs, fetchDrafts]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        if (activeTab === "published" && hasMore) {
          fetchBlogs(page);
        } else if (activeTab === "drafts" && hasMoreDrafts) {
          fetchDrafts(draftPage);
        }
      }
    },
    [
      activeTab,
      fetchBlogs,
      fetchDrafts,
      hasMore,
      hasMoreDrafts,
      isLoading,
      page,
      draftPage,
    ]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [handleObserver]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  const handleUpdate = async (updatedBlog: IBlog) => {
    try {
      setIsLoading(true);
      const response = await updateBlogs(updatedBlog);
      console.log(response);

      toast.success(response.msg);
      if (updatedBlog.isPublished) {
        setPublishedBlogs((prev) =>
          prev.map((blog) =>
            blog._id === updatedBlog._id ? updatedBlog : blog
          )
        );
        setDraftBlogs((prev) =>
          prev.filter((blog) => blog._id !== updatedBlog._id)
        );
      } else {
        setDraftBlogs((prev) =>
          prev.map((blog) =>
            blog._id === updatedBlog._id ? updatedBlog : blog
          )
        );
        setPublishedBlogs((prev) =>
          prev.filter((blog) => blog._id !== updatedBlog._id)
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update blog");
    } finally {
      setIsLoading(false);
      setEditingBlog(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteBlog(id);
      setPublishedBlogs((prev) => prev.filter((blog) => blog._id !== id));
      setDraftBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handlePublishSuccess = useCallback(
    (blogId: string) => {
      console.log(blogId);
      console.log(publishedBlogs);

      const publishedBlog = publishedBlogs.find((blog) => blog._id === blogId);
      console.log(publishedBlog);

      if (publishedBlog) {
        const updatedBlog = { ...publishedBlog, isPublished: true };
        setDraftBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
        setPublishedBlogs((prev) => [updatedBlog, ...prev]);
      }
    },
    [publishedBlogs]
  );

  const currentLoading =
    activeTab === "published" ? isLoading : isLoadingDrafts;
  const noBlogs = filteredBlogs.length === 0;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  My Blog Posts
                </h1>
                <p className="text-gray-400 text-sm">
                  Welcome back, {user?.username}!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/create-blog")}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                <FiPlus className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                Create New
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <FiEye className="text-lg" />
                View All
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Controls Section */}
        <div className="mb-8 space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "published"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveTab("published")}>
                Published ({publishedBlogs.length})
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "drafts"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveTab("drafts")}>
                Drafts ({draftBlogs.length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white"
                }`}>
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white"
                }`}>
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            />
          </div>
        </div>

        {initialLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <LoadingSpinner />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
          </div>
        ) : noBlogs ? (
          <div className="text-center py-16">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-white/10">
                <svg
                  className="h-16 w-16 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              {searchQuery
                ? "No blogs found"
                : activeTab === "published"
                ? "Ready to share your thoughts?"
                : "Start writing your ideas"}
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? `No blogs match "${searchQuery}". Try a different search term.`
                : activeTab === "published"
                ? "Your published blogs will appear here once you create and publish them."
                : "Save your work as drafts and publish them when you're ready."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/create-blog")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                <FiPlus className="text-lg" />
                {activeTab === "published"
                  ? "Create Your First Blog"
                  : "Start Writing"}
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
              {filteredBlogs.map((blog, index) => (
                <div
                  key={blog._id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <div className="relative">
                    <BlogCard
                      key={blog._id}
                      id={blog._id}
                      author={user.username || "Unknown"}
                      title={blog.title}
                      content={blog.content}
                      imageUrl={blog.imageUrl}
                      date={new Date(blog.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                      status={blog.isPublished}
                      onPublishSuccess={
                        !blog.isPublished ? handlePublishSuccess : undefined
                      }
                    />

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {!blog.isPublished && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingBlog(blog._id);
                          }}
                          className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 hover:scale-110"
                          title="Edit Draft">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setBlogToDelete(blog._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-110"
                        title="Delete Blog">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading spinner for pagination */}
            {currentLoading && filteredBlogs.length > 0 && (
              <div className="flex justify-center items-center mt-12">
                <div className="relative">
                  <LoadingSpinner />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Intersection observer target */}
            <div ref={loadMoreRef} className="h-1" aria-hidden="true" />
          </>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => blogToDelete && handleDelete(blogToDelete)}
            title="Confirm Deletion"
            message="Are you sure you want to delete this blog? This action cannot be undone."
          />
        )}

        {/* Edit Modal */}
        {editingBlogId && (
          <EditBlogModal
            blogId={editingBlogId}
            onClose={() => setEditingBlog(null)}
            onSave={handleUpdate}
            isLoading={isLoading}
          />
        )}
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default MyBlogs;
