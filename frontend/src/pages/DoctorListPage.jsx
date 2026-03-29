import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>Choose Doctor</h3>

      {doctors.map(d => (
        <div key={d.id} className="card p-3 mb-2">
          <h5>{d.name}</h5>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/booking/${d.id}`)}
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
}

export default DoctorListPage;