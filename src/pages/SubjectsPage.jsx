import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UploadingAnimation from "../assets/uploading.gif";
import axios from "axios";
import PropTypes from "prop-types";

// Subject button component for better reusability
const SubjectButton = ({ subject, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(subject)}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      isSelected
        ? "bg-green-600 text-white"
        : "bg-white text-gray-800 hover:bg-gray-100"
    } shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
    aria-label={`Select ${subject.name}`}
  >
    {subject.name}
  </button>
);

SubjectButton.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// Subject details component
const SubjectDetails = ({ subject, onNavigate }) => {
  const chapters = subject.chapterIds.reduce((acc, chap) => {
    acc[chap._id] = { name: chap.name, lessons: [] };
    return acc;
  }, {});

  subject.lessonIds.forEach((lesson) => {
    if (chapters[lesson.chapterId]) {
      chapters[lesson.chapterId].lessons.push({
        name: lesson.name,
        _id: lesson._id,
      });
    }
  });

  // Generate letter prefixes for chapters (A, B, C, ...)
  const chapterEntries = Object.entries(chapters);
  const letterPrefixes = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  return (
    <section className="mt-6 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        {subject.classId.title} {subject.name}
      </h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Explore the {subject.name.toLowerCase()} skills for{" "}
        {subject.classId.title}. These skills are organized into categories.
        Hover over any skill to preview it, or click to start practicing. Your
        progress will be tracked, with questions increasing in difficulty as you
        improve.
      </p>
      <div className="flex flex-row flex-wrap gap-8">
        {chapterEntries.map(([id, chapter], chapterIndex) =>
          chapter.lessons.length > 0 ? (
            <div key={id} className="flex flex-col items-leeft w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {chapter.name}
              </h3>
              <ul className="list-none space-y-1">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={lesson._id}
                    className="text-gray-600 hover:underline cursor-pointer text-left"
                    onClick={() => onNavigate(subject.name, lesson)}
                  >
                    {`${letterPrefixes[chapterIndex]}.${lessonIndex + 1}`}{" "}
                    {lesson.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

SubjectDetails.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    classId: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    chapterIds: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    lessonIds: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        chapterId: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onNavigate: PropTypes.func.isRequired,
};

function SubjectsPage() {
  const { classId } = useParams();
  console.log("classId:", classId);
  const navigate = useNavigate();
  const [subjectsData, setSubjectsData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingImage] = useState(UploadingAnimation);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!classId) {
        setError("Invalid class ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log(
          "Fetching from:",
          // `http://localhost:5000/api/subjects/${classId}`
          `https://ilx-backend.onrender.com/api/subjects/${classId}`
        );
        const questionsRes = await axios.get(
          // `http://localhost:5000/api/subjects/${classId}`
          `https://ilx-backend.onrender.com/api/subjects/${classId}`
        );
        console.log("Response from API:", questionsRes.data);
        if (questionsRes.data.length > 0) {
          setSubjectsData(questionsRes.data);
          setSelectedSubject(questionsRes.data[0]);
          setError(null);
        } else {
          setSubjectsData([]);
          setError("No subjects available for this lesson.");
        }
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
        setError("Failed to load questions. Please try again later.");
        setSubjectsData([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        });
      }
    };

    fetchQuestions();
  }, [classId]);

  const onNavigate = useCallback(
    (category, lesson) => {
      // Encode lesson name to make it URL-safe
      const encodedLessonName = encodeURIComponent(lesson.name);
      // Include both lesson.id and encoded lesson name in the URL
      navigate(`/practice/${classId}/${lesson._id}/${encodedLessonName}`);
    },
    [classId, navigate]
  );
  const handleSelectSubject = useCallback((subject) => {
    setSelectedSubject(subject);
  }, []);

  return (
    <div className="text-left p-6 max-w-4xl mx-auto">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <img src={loadingImage} alt="Loading..." className="w-16 h-16" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <>
            <nav className="flex flex-wrap gap-4 mb-8">
              {subjectsData.map((subject) => (
                <SubjectButton
                  key={subject._id}
                  subject={subject}
                  isSelected={selectedSubject?._id === subject._id}
                  onSelect={handleSelectSubject}
                />
              ))}
            </nav>
            {selectedSubject && (
              <SubjectDetails
                subject={selectedSubject}
                onNavigate={onNavigate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SubjectsPage;
