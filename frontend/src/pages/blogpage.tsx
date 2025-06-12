import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import type { IBlog } from "../interface/interface";
import {  getBlogByid } from "../service/authservice";

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleGoBack = useCallback(() => {
    navigate(-1); // Go back to previous page instead of always going to home
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const retryFetch = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response:any = await getBlogByid(id);
      console.log(response,'blog is ');
      
      setBlog(response.data.blog);
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      setError("Failed to load blog. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("Invalid blog ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getBlogByid(id);
      console.log(response.data.data,'blog is ');

        setBlog(response.data.data.blog);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Enhanced loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Skeleton loader */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="flex gap-4 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry option
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {error ? "Something went wrong" : "Blog not found"}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "The blog post you're looking for doesn't exist or has been removed."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {error && (
                <button
                  onClick={retryFetch}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Retry loading blog"
                >
                  Try Again
                </button>
              )}
              
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Go back to previous page"
              >
                Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Return to home page"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Navigation */}
            <nav className="mb-8">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-medium focus:outline-none focus:underline"
                aria-label="Go back to previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {blog.title}
                </span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <time 
                  dateTime={blog.createdAt}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(blog.createdAt)}
                </time>

                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {blog.userId?.username || "Unknown Author"}</span>
                </div>

                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{calculateReadingTime(blog.content)} min read</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {blog.imageUrl && (
              <div className="mb-8 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <div className="relative">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  
                  {!imageError ? (
                    <img
                     src={import.meta.env.VITE_SERVER_URL + "/uploads/" + blog.imageUrl}
                      alt={blog.title}
                      className={`w-full h-auto max-h-96 object-cover transition-opacity duration-300 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      loading="lazy"
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Image unavailable</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div 
                className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
                style={{ lineHeight: '1.8' }}
              >
                {blog.content}
              </div>
            </div>

            {/* Footer Actions */}
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Posts
                </button>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Published {formatDate(blog.createdAt)}
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;