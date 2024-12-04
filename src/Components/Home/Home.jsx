import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

const Home = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/Event?search=${encodeURIComponent(input)}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="home-wrapper">
      <div className="container">
        <h1>Find it .</h1>
        <h1> Plan it .</h1>
        <h1> Do it !</h1>
        <div className="input-wrapper">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
          <input
            placeholder="Type to search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
