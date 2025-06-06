import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown, Calendar, User } from "lucide-react";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/auth/news/");

        console.log("API raw response:", res.data);
        const formattedArticles = res.data.articles.map((item, index) => ({
          id: index + 1,
          title: item.title,
          author: item.author || "Unknown",
          date: new Date(item.publishedAt).toISOString().split("T")[0],
          content: item.description || "No content available.",
          likes: 0,
          dislikes: 0,
          category: item.source.name,
        }));
        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleLike = (id) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, likes: article.likes + 1 } : article
      )
    );
  };

  const handleDislike = (id) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? { ...article, dislikes: article.dislikes + 1 }
          : article
      )
    );
  };

  if (loading) {
    return <div className="loading">Loading latest news...</div>;
  }

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to NewsNexus</h1>
          <p>
            Your trusted source for the latest news and updates from around the
            world
          </p>
        </div>
      </div>

      <div className="container">
        <div className="articles-section">
          <h2>Latest News</h2>
          <div className="articles-grid">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-header">
                  <span className="article-category">{article.category}</span>
                </div>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-content">{article.content}</p>

                <div className="article-meta">
                  <div className="article-author">
                    <User size={16} />
                    <span>{article.author}</span>
                  </div>
                  <div className="article-date">
                    <Calendar size={16} />
                    <span>{article.date}</span>
                  </div>
                </div>

                <div className="article-actions">
                  <button
                    className="like-btn"
                    onClick={() => handleLike(article.id)}
                  >
                    <ThumbsUp size={16} />
                    <span>{article.likes}</span>
                  </button>
                  <button
                    className="dislike-btn"
                    onClick={() => handleDislike(article.id)}
                  >
                    <ThumbsDown size={16} />
                    <span>{article.dislikes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
