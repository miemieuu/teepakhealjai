import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import '../styles/styles.css';

const Home = () => {
  const [condos, setCondos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [latestProjects, setLatestProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQXjko2b4VXC2xj26V1M0AW4_EpV7l8EHBBYfx58drMe0DU4PGFGTis8uKd4upjlGCocdQ1C-Kapb0K/pub?output=csv"
        );
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const data = result.data.map((item) => ({
              ...item,
              id: parseInt(item.id), // แปลง id เป็นตัวเลข
            }));

            console.log("Fetched Data:", data); // log ข้อมูลที่ดึงมา
            setCondos(data);

            // ดึง "ย่าน" ไม่ซ้ำ
            const uniqueLocations = [...new Set(data.map((item) => item.location))];
            console.log("Unique Locations:", uniqueLocations); // log location
            setLocations(uniqueLocations);

            // ดึงโครงการแรกๆ 5-6 โครงการ (ใช้ slice(0, 6) ดึง 6 รายการแรก)
            setLatestProjects(data.slice(0, 6));
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>ชีวิตเหนือระดับ..กับคอนโดที่ตอบโจทย์ทุกไลฟ์สไตล์</h1>
      </header>

      {selectedLocation === null ? (
        <>
          {/* 🔥 โครงการล่าสุด 🔥 */}
          <section className="latest-projects">
            <h2>โครงการล่าสุด</h2>
            <div className="project-list">
              {latestProjects.map((condo, index) => (
                <div key={index} className="project-card">
                  <img
                    src={condo.sample_image || 'fallback-image-url.jpg'}
                    alt={condo.condominium_project_th || "คอนโด"}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <h3>{condo.condominium_project_th}</h3>
                  <p>ราคา: {condo.price} บาท</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🔥 ทำเลที่น่าสนใจ 🔥 */}
          <section className="location-list">
            <h2>ทำเลที่น่าสนใจ</h2>
            <div className="locations">
              {locations.map((location, index) => (
                <button key={index} onClick={() => setSelectedLocation(location)}>
                  {location}
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="condo-list">
          <button onClick={() => setSelectedLocation(null)}>🔙 กลับไปเลือกย่าน</button>
          <h2>คอนโดในย่าน: {selectedLocation}</h2>
          {condos
            .filter((condo) => condo.location === selectedLocation)
            .map((condo, index) => (
              <div key={index} className="condo-card">
                <img
                  src={condo.sample_image || 'fallback-image-url.jpg'}
                  alt={condo.condominium_project_th}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <h2>{condo.condominium_project_th}</h2>
                <p>ราคา: {condo.price} บาท</p>
              </div>
            ))}
        </section>
      )}
    </div>
  );
};

export default Home;
