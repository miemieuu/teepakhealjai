import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import '../styles/styles.css';

//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

//image
import salaya from '../images/salaya.png';
import pinklao from '../images/pinklao.png';
import phetkasem from '../images/phetkasem.png';
import charansanitwong from '../images/charansanitwong.png';
import mrt from '../images/mrt.png';
import bts from '../images/bts.png';
import ekkamai from '../images/ekkamai.jpg';
import rajchatawee from '../images/rajchatawee.jpg';

const Home = () => {
  const [condos, setCondos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [latestProjects, setLatestProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("rent");
  const [filteredCondos, setFilteredCondos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const imageMap = {
    "ศาลายา": salaya,
    "ปิ่นเกล้า": pinklao,
    "เพชรเกษม": phetkasem,
    "จรัญสนิทวงศ์": charansanitwong,
    "MRT พระราม 9": mrt,
    "BTS วุฒากาศ": bts,
    "เอกมัย": ekkamai,
    "ราชเทวี": rajchatawee
  };

  const fetchData = async () => {
    try {
      const rentURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQXjko2b4VXC2xj26V1M0AW4_EpV7l8EHBBYfx58drMe0DU4PGFGTis8uKd4upjlGCocdQ1C-Kapb0K/pub?output=csv";
      const saleURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSj9H7v0yQMhpcYcnCe6q_CkulJrWuRnP4A40mUj7MixDp2o-q5LMYECwTInmr5uf2_Z7384E5Q7LZz/pub?output=csv";

      const [rentResponse, saleResponse] = await Promise.all([
        axios.get(rentURL),
        axios.get(saleURL)
      ]);

      const parseCSV = (csvData) => new Promise((resolve) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => resolve(result.data),
        });
      });

      const rentData = await parseCSV(rentResponse.data);
      const saleData = await parseCSV(saleResponse.data);

      const combinedData = [
        ...rentData.map(item => ({ ...item, type: "เช่า" })),
        ...saleData.map(item => ({ ...item, type: "ขาย" }))
      ];

      const formattedData = combinedData.map((item, index) => ({
        ...item,
        id: index + 1,
        price: item.price ? parseFloat(item.price.replace(/,/g, "")) : 0,
      }));

      setCondos(formattedData);

      const uniqueLocations = [...new Set(formattedData.map((item) => item.location))];
      setLocations(uniqueLocations);

      setLatestProjects(formattedData.slice(0, 6));

    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    const filtered = condos.filter((condo) => 
      condo.condominium_project_th.toLowerCase().includes(e.target.value.toLowerCase()) && condo.type === (selectedTab === "rent" ? "เช่า" : "ขาย")
    );
    setFilteredCondos(filtered);
  };

  const handleSelectCondo = (id) => {
    setSearchTerm('');
    setShowDropdown(false);
    window.location.href = `/condo/${id}`;
  };
  return (
    <div className="home-container">
       <header className="hero-section">
        <h1>ค้นหาคอนโดที่ใช่สำหรับคุณ</h1>

        <div className="search-bar-container">
          <div className="tab-container">
            <button className={selectedTab === "rent" ? "active" : ""} style={{ backgroundColor: selectedTab === "rent" ? "orange" : "white" }} onClick={() => setSelectedTab("rent")}>
              เช่า
            </button>
            <button className={selectedTab === "sale" ? "active" : ""} style={{ backgroundColor: selectedTab === "sale" ? "orange" : "white" }} onClick={() => setSelectedTab("sale")}>
              ขาย
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="ค้นหาคอนโด..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            {showDropdown && (
              <div className="dropdown">
                {filteredCondos.map((condo) => (
                  <div key={condo.id} className="dropdown-item" onClick={() => handleSelectCondo(condo.id)}>
                    {condo.condominium_project_th} ({condo.type})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {selectedLocation === null ? (
        <>
          <section className="location-list">
            <h2 className="title">ทำเลที่น่าสนใจ</h2>
            <div className="locations-container">
              {locations.filter(location => location.trim() !== "").map((location, index) => (
                <button key={index} onClick={() => setSelectedLocation(location)} className="location-card">
                  <img src={imageMap[location] || "/images/default.jpg"} alt={location} className="location-image" />
                  <div className="overlay">
                    <span className="location-name">{location}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="latest-projects">
            <h2>โครงการล่าสุด</h2>
            <div className="project-list">
              {latestProjects.map((condo, index) => (
                <div key={index} className="project-card">
                  <img src={condo.sample_image || 'fallback-image-url.jpg'} alt={condo.condominium_project_th || "คอนโด"} />
                  <h3>{condo.condominium_project_th}</h3>
                  <p>ราคา: {condo.price} บาท ({condo.type})</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="condo-list">
          <button onClick={() => setSelectedLocation(null)}>🔙 กลับไปเลือกย่าน</button>
          <h2>คอนโดในย่าน: {selectedLocation}</h2>
          {condos.filter((condo) => condo.location === selectedLocation).map((condo, index) => (
            <div key={index} className="condo-card">
              <img src={condo.sample_image || 'fallback-image-url.jpg'} alt={condo.condominium_project_th} />
              <h2>{condo.condominium_project_th}</h2>
              <p>ราคา: {condo.price} บาท ({condo.type})</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Home;
