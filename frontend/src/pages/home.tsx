"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "../contexts/auth.contexts"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import type { IBlog } from "../interface/interface" 
// import { fetching } from
import BlogCard from "../components/BlogCard"
// import { logoutUser } from 
import { getAllBlogs } from "../service/authservice"

interface BlogResponse {
  blogs: IBlog[]
  total: number
  page: number
  totalPages: number
}

const Home: React.FC = () => {
  const { user, logout } = useAuth()
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const isInitialMount = useRef(true)

  const fetchBlogs = useCallback(
    async (pageNum: number) => {
      if (isLoading || !hasMore) return
      setIsLoading(true)
      setError(null)

      try {
        const response: BlogResponse = await getAllBlogs(pageNum, 1)
console.log(response,'resp is ');

        setBlogs((prev) => {
          // Filter out duplicates (in case of overlapping fetches)
          const newBlogs = response.data.filter((newBlog) => !prev.some((blog) => blog._id === newBlog._id))
          return [...prev, ...newBlogs]
        })

        setHasMore(pageNum < response.total)
        setPage(pageNum + 1)
      } catch (error: any) {
        console.error("Failed to fetch blogs:", error)
        setError(error.message || "Failed to load blogs")
        toast.error(error.message || "Failed to load blogs")
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, hasMore],
  )

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchBlogs(1) // Initial fetch
    }
  }, [fetchBlogs])

  // IntersectionObserver to trigger fetching next page
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !isLoading) {
        console.log("IntersectionObserver triggered, fetching page:", page)
        fetchBlogs(page)
      }
    },
    [fetchBlogs, hasMore, isLoading, page],
  )

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    })

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [handleObserver])

  const handleLogout = async () => {
    try {
      // const response = await logoutUser()
      if (response.ok) {
        logout()
        toast.success("Logged out successfully")
        setShowLogoutModal(false)
        navigate("/")
      } else {
        toast.error(response.message || "Failed to logout")
      }
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error(error.message || "Failed to logout")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 transform transition-all duration-300 scale-100">
            <h3 className="text-2xl font-bold mb-4 text-white">Confirm Logout</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to logout from your account?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-200 font-medium"
                aria-label="Confirm logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg shadow-lg sticky top-0 z-40 w-full border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-300 group-hover:to-cyan-300">
              BlogSphere
            </span>
          </Link>
          <div className="flex gap-3 md:gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/my-blogs")}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 shadow-lg shadow-emerald-700/20 font-medium text-sm md:text-base"
                  aria-label="View my blogs"
                >
                  My Blogs
                </button>
                <button
                  onClick={() => navigate("/create-blog")}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-700/20 font-medium text-sm md:text-base"
                  aria-label="Create a new blog"
                >
                  Create Blog
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-400 hover:to-pink-500 transition-all duration-200 shadow-lg shadow-rose-700/20 font-medium text-sm md:text-base"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-700/20 font-medium"
                aria-label="Go to login page"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-white">Discover Amazing</span>
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent pb-3">
                Stories & Ideas
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Join our community of writers and readers to explore thought-provoking content
            </p>
            {!user && (
              <div className="mt-10 flex justify-center gap-4">
                <button
                  onClick={() => navigate("/auth")}
                  className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-700/20 font-medium text-lg"
                >
                  Get Started
                </button>
                <button
                  onClick={() => {
                    const blogsSection = document.getElementById("blogs-section")
                    if (blogsSection) {
                      blogsSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium text-lg border border-gray-700"
                >
                  Explore Blogs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="blogs-section" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {user ? "Your Dashboard" : "Featured Articles"}
          </h2>
          {user && (
            <button
              onClick={() => navigate("/create-blog")}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-700/20 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Blog
            </button>
          )}
        </div>

        {error && (
          <div
            className="mb-8 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-xl text-center shadow-lg"
            role="alert"
            aria-describedby="error-message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto mb-2 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span id="error-message" className="font-medium">
              {error}
            </span>
          </div>
        )}

        {isLoading && blogs.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <svg
              className="animate-spin h-12 w-12 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-400">Loading amazing content...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700 shadow-xl">
            <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-200 mb-4">
              {user ? "You haven't created any blogs yet" : "No blogs available yet"}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {user
                ? "Share your thoughts and ideas with the world by creating your first blog post."
                : "Be the first to contribute to our growing community of writers and readers."}
            </p>
            <button
              onClick={() => navigate(user ? "/create-blog" : "/auth")}
              className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-700/20 font-medium"
              aria-label={user ? "Create your first blog" : "Join now"}
            >
              {user ? "Create Your First Blog" : "Join Now"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                content={blog.content}
                imageUrl={blog.imageUrl}
                author={blog.userId?.username || "Unknown"}
                status={blog.isPublished}
                date={new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            ))}
          </div>
        )}

        {isLoading && blogs.length > 0 && (
          <div className="flex justify-center items-center mt-12">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-3 text-gray-400">Loading more articles...</p>
            </div>
          </div>
        )}

        <div ref={loadMoreRef} className="h-1" aria-hidden="true" />
      </main>

      {/* Features Section */}
      {!user && blogs.length > 0 && (
        <section className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Why Join BlogSphere?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect with a community of passionate writers and readers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl">
                <div className="w-14 h-14 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Express Yourself</h3>
                <p className="text-gray-300">
                  Share your unique perspective and ideas with a global audience through our intuitive writing platform.
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl">
                <div className="w-14 h-14 bg-cyan-900/50 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Build Community</h3>
                <p className="text-gray-300">
                  Connect with like-minded individuals, receive feedback, and engage in meaningful discussions.
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl">
                <div className="w-14 h-14 bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Secure Platform</h3>
                <p className="text-gray-300">
                  Enjoy a safe and reliable platform with full control over your content and privacy settings.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-700/20 font-medium"
              >
                Join Our Community
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              >
                BlogSphere
              </Link>
              <p className="text-gray-400 mt-4 max-w-xs">
                A platform for writers and readers to share ideas, stories, and knowledge with the world.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
