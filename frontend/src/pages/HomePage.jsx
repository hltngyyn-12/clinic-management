import { useEffect } from "react";

function HomePage() {

  useEffect(() => {
    fetch("http://localhost:8080")
      .then(res => res.text())
      .then(data => console.log("Backend response:", data))
      .catch(err => console.error("Error connecting to backend:", err));
  }, []);

  return (
    <div>
      <h3>Home Page</h3>
      <p>Frontend ReactJS is running successfully.</p>
    </div>
  );
}

export default HomePage;