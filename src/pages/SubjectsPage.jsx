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
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm ${
      isSelected
        ? "bg-green-600 text-white"
        : "bg-white text-gray-800 hover:bg-gray-100"
    }`}
    aria-pressed={isSelected}
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
  const chapterMap = {};
  subject.chapterIds.forEach((chap) => {
    chapterMap[chap._id] = { name: chap.name, lessons: [] };
  });
  subject.lessonIds.forEach((lesson) => {
    if (chapterMap[lesson.chapterId]) {
      chapterMap[lesson.chapterId].lessons.push({
        name: lesson.name,
        _id: lesson._id,
      });
    }
  });

  const chapterEntries = Object.entries(chapterMap);
  const letterPrefixes = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  // Arrange chapters: A & B in column 1, C & D in column 2, E & F in column 1, G & H in column 2, etc.
  // That is: even-indexed pairs in col 1, odd-indexed pairs in col 2.
  const col1 = [];
  const col2 = [];
  for (let i = 0; i < chapterEntries.length; i += 2) {
    if ((i / 2) % 2 === 0) {
      // Even pair: goes to col1
      col1.push(chapterEntries.slice(i, i + 2));
    } else {
      // Odd pair: goes to col2
      col2.push(chapterEntries.slice(i, i + 2));
    }
  }

  // Flatten columns for rendering
  const flattenChapters = (col) =>
    col.flat().map(([id, chapter], idx) => ({
      id,
      chapter,
      letter: letterPrefixes[
        chapterEntries.findIndex(([cid]) => cid === id)
      ] || "?",
      chapterIdx: chapterEntries.findIndex(([cid]) => cid === id),
    }));

  const chaptersCol1 = flattenChapters(col1);
  const chaptersCol2 = flattenChapters(col2);

  return (
    <section className="mt-6 p-6 bg-white rounded-lg shadow-md text-sm">
      <h2 className="text-xl font-bold text-green-600 mb-4">
        {subject.classId.title} {subject.name}
      </h2>
      <p className="text-gray-600 mb-6 leading-relaxed text-xs">
        Explore the <strong>{subject.name.toLowerCase()}</strong> skills for{" "}
        {subject.classId.title}. These skills are organized into categories.
        Hover over any skill to preview it, or click to start practicing. Your
        progress will be tracked, with questions increasing in difficulty as you
        improve.
      </p>

      {/* Custom two-column chapter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[chaptersCol1, chaptersCol2].map((chapters, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-6">
            {chapters.map(({ id, chapter, letter, chapterIdx }) =>
              chapter.lessons.length > 0 ? (
                <div
                  key={id}
                  className=" rounded-lg overflow-hidden h-auto text-xs mb-0"
                >
                  {/* Chapter Title */}
                  <h3 className="bg-gray-50 px-2 py-3 font-semibold text-gray-800 text-base">
                    {`${letter}.`} {chapter.name}
                  </h3>

                  {/* Lesson List under this chapter */}
                  <ul>
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <li
                        key={lesson._id}
                        className="px-2 py-1 hover:bg-gray-50 cursor-pointer transition-colors text-xs"
                        onClick={() => onNavigate(subject.name, lesson)}
                      >
                        <span className="text-green-600 font-medium mr-2">
                          {`${letter}.${lessonIndex + 1}`}
                        </span>
                        <span className="text-gray-700">{lesson.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        ))}
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
  const navigate = useNavigate();
  const [subjectsData, setSubjectsData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadingImage = UploadingAnimation;

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!classId) {
        setError("Invalid class ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://ilx-backend.onrender.com/api/subjects/${classId}`
        );
        console.log("Subjects fetched:", response.data);

        if (response.data.length > 0) {
          setSubjectsData(response.data);
          setSelectedSubject(response.data[0]);
          setError(null);
        } else {
          setSubjectsData([]);
          setError("No subjects available for this class.");
        }
      } catch (err) {
        console.error("Error fetching subjects:", err.message);
        setError("Failed to load subjects. Please try again later.");
        setSubjectsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [classId]);

  const onNavigate = useCallback(
    (category, lesson) => {
      const encodedLessonName = encodeURIComponent(lesson.name);
      navigate(`/practice/${classId}/${lesson._id}/${encodedLessonName}`);
    },
    [classId, navigate]
  );

  const handleSelectSubject = useCallback((subject) => {
    setSelectedSubject(subject);
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <img src={loadingImage} alt="Loading..." className="w-16 h-16" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-6 bg-red-50 rounded-md shadow-sm">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Subject selection buttons */}
          <nav className="flex flex-wrap gap-3 mb-6">
            {subjectsData.map((subject) => (
              <SubjectButton
                key={subject._id}
                subject={subject}
                isSelected={selectedSubject?._id === subject._id}
                onSelect={handleSelectSubject}
              />
            ))}
          </nav>

          {/* Display selected subject details */}
          {selectedSubject && (
            <SubjectDetails subject={selectedSubject} onNavigate={onNavigate} />
          )}
        </>
      )}
    </div>
  );
}

export default SubjectsPage;
