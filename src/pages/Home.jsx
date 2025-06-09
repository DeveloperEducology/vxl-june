import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadingAnimation from "../assets/uploading.gif";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [loadingImage] = useState(UploadingAnimation);
  const [classData, setClassData] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [loadingImage] = useState(UploadingAnimation);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true); // start loading
      try {
        const questionsRes = await axios.get(
          `https://ilx-backend.onrender.com/api/classes`
          // `http://localhost:5000/api/classes`
        );
        console.log("classes data", questionsRes.data);
        if (questionsRes.data.length > 0) {
          setClassData(questionsRes.data);
          setError(null);
        } else {
          setClassData([]);
          setError("No questions available for this lesson.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load questions. Please try again later.");
        setClassData([]);
      } finally {
        // setLoading(false); // stop loading
        setTimeout(() => {
          setLoading(false); // stop loading after 2 seconds
        }, 100);
      }
    };

    fetchQuestions();
  }, []);

  // If jsonData is still loading or not available, show a loading state
  if (!classData || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src={loadingImage}
          alt="Loading"
          className="w-24 h-24 rounded-full"
        />
      </div>
    );
  }

  // Filter classes where status is "TRUE"
  // const activeClasses = clsData.filter(
  //   (classItem) => classItem.status === "TRUE"
  // );
  const activeClasses = classData;

  // Sort classes by _id in ascending order (assuming _id is a string or number)
  const sortedClasses = [...activeClasses].sort((a, b) => {
    if (a._id < b._id) return -1;
    if (a._id > b._id) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-w-4xl mx-auto">
      {sortedClasses.length > 0 ? (
        sortedClasses.map((classItem, index) => (
          <div
            key={classItem._id || index}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/subjects/${classItem._id || index}`)}
          >
            <h2 className=" text-lg font-semibold text-gray-800 mb-2">
              {classItem._id === "LKG" || classItem._id === "UKG"
                ? classItem._id
                : `${classItem.title || classItem._id}`}
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              {classItem.description || "No description available"}
            </p>
            <div className="flex justify-between text-xs">
              <span>Maths</span>
              <span>{classItem.mathSkills || "N/A"} skills &gt;&gt;</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>English</span>
              <span>{classItem.englishSkills || "N/A"} skills &gt;&gt;</span>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-600 py-10">
          No active classes available.
        </div>
      )}
    </div>
  );
}

export default Home;
