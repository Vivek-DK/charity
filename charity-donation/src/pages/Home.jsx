import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import Navbar from "../components/Navbar";

const cardData = [
  {
    id: 1,
    title: "Help Flood Victims",
    story: "Providing food, shelter, and medical aid to families affected by floods.",
    date: "Aug 20, 2025",
    raised: "₹50,000 / ₹1,00,000",
    image: img1
  },
  {
    id: 2,
    title: "Educate Every Child",
    story: "Support underprivileged children with access to quality education and resources.",
    date: "Sep 1, 2025",
    raised: "₹1,25,000 / ₹2,00,000",
    image: img2
  },
  {
    id: 3,
    title: "Feed the Hungry",
    story: "Join us in serving daily meals to the homeless and poor communities.",
    date: "Sep 5, 2025",
    raised: "₹75,000 / ₹1,50,000",
    image: img3
  },
  {
    id: 4,
    title: "Medical Support",
    story: "Providing healthcare and medicines for families who cannot afford treatment.",
    date: "Sep 10, 2025",
    raised: "₹30,000 / ₹1,00,000",
    image: img4
  },
  {
    id: 5,
    title: "Save the Environment",
    story: "Tree plantation drives and awareness campaigns for a greener tomorrow.",
    date: "Sep 15, 2025",
    raised: "₹40,000 / ₹1,50,000",
    image: img5
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/detail/${id}`, { state: cardData.find((c) => c.id === id) });
  };

  return (
      <div className="home-container">
        <Navbar />
        <h1 className="home-title">Make a Difference ❤️</h1>
        <div className="card-grid">
          {cardData.map((card) => (
            <div
              key={card.id}
              className="donation-card"
              onClick={() => handleCardClick(card.id)}
            >
              <img src={card.image} alt={card.title} className="card-img" />
              <div className="card-content">
                <div className="card-left">
                  <h2 className="card-title">{card.title}</h2>
                  <p className="card-story">{card.story}</p>
                </div>
                <div className="card-right">
                  <p className="card-date">{card.date}</p>
                  <button className="donate-btn">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default Home;
