import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';
import { ChevronDown, ChevronUp, Star, Shield, Trophy, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Crypto Enthusiast",
      content: "The transparency of blockchain-based draws gave me confidence. Won my first jackpot last month!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Regular Player",
      content: "The most user-friendly lottery platform I've ever used. The instant purchases are a game-changer.",
      rating: 5
    },
    {
      name: "Elena Kowalski",
      role: "NFT Collector",
      content: "Love how they've merged traditional lottery with blockchain technology. The future is here!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does the blockchain lottery work?",
      answer: "Our lottery system utilizes smart contracts on the blockchain to ensure complete transparency and fairness. Every ticket purchase and draw is recorded on the blockchain, making it impossible to manipulate results."
    },
    {
      question: "How do I claim my winnings?",
      answer: "Winnings are automatically transferred to your connected wallet within 24 hours of the draw. For large jackpots, our team will contact you directly to arrange the transfer."
    },
    {
      question: "Is my digital wallet secure?",
      answer: "We implement military-grade encryption and multi-signature security protocols to ensure your digital wallet and assets are protected at all times."
    },
    {
      question: "How often are draws conducted?",
      answer: "Draws are conducted daily at 3 PM UTC. Results are immediately published on the blockchain and our platform."
    }
  ];

  const features = [
    {
      title: "Instant Ticket Purchase",
      description: "Buy your tickets in seconds and join the draw instantly"
    },
    {
      title: "Secure Wallet Integration",
      description: "Your tickets and winnings are safely stored in your secure digital wallet"
    },
    {
      title: "Fair & Transparent Draws",
      description: "Every draw is conducted on the blockchain, ensuring fairness and transparency"
    },
    {
      title: "Easy to Play",
      description: "Simple and user-friendly interface for a seamless lottery experience"
    }
  ];

  return (
    <div className="home-container">
      <div className="particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                '--size': `${Math.random() * 10 + 5}px`,  
                '--speed': `${Math.random() * 3 + 2}s`,  
              }}
            />
          ))}
       </div>


      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="holographic-text">Dream Bigger</span>
            <span className="neon-subtitle">With Every Ticket</span>
          </h1>
          <p className="hero-subtitle">
            Join millions of players and get a chance to win life-changing prizes
            <span className="blinking-cursor">_</span>
          </p>

          <div className="stats-grid">
            <div className="stat-card holographic-border">
              <Trophy className="stat-icon" size={32} />
              <div className="stat-content">
                <span className="stat-value">$50M+</span>
                <span className="stat-label">Total Prizes</span>
              </div>
            </div>
            <div className="stat-card holographic-border">
              <Users className="stat-icon" size={32} />
              <div className="stat-content">
                <span className="stat-value">1M+</span>
                <span className="stat-label">Players</span>
              </div>
            </div>
            <div className="stat-card holographic-border">
              <Shield className="stat-icon" size={32} />
              <div className="stat-content">
                <span className="stat-value">100%</span>
                <span className="stat-label">Secure</span>
              </div>
            </div>
          </div>

          <button className="neon-cta" onClick={() => navigate('/buy-tickets')}>
            <span className="cta-text">Play Now</span>
            <div className="neon-overlay" />
          </button>
        </div>
      </section>

      <section className="feature-section">
        <div className="grid-pattern" />
        {features.map((feature, index) => (
          <div key={index} className="feature-card" style={{ '--delay': `${index * 0.1}s` }}>
            <div className="card-glow" />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className="hover-reveal">
              <span className="learn-more">Explore Feature →</span>
            </div>
          </div>
        ))}
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">Player Experiences</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card glow-hover">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="star-icon" size={18} />
                ))}
              </div>
              <p className="testimonial-content">{testimonial.content}</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
              <div className="testimonial-glow" />
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <h2 className="section-title">Knowledge Nexus</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item" onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}>
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {activeQuestion === index ? <ChevronUp className="icon-3d" /> : <ChevronDown className="icon-3d" />}
              </div>
              {activeQuestion === index && <div className="faq-answer">{faq.answer}</div>}
              <div className="faq-glow" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
