import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SubjectsPage from "./pages/SubjectsPage";
import Quiz from "./pages/Quiz";
import MathQuestionForm from "./components/editor/MathQuestionForm";
import EditorWithMathRenderer from "./components/editor/EditorWithMathRenderer";
import NumberSorting from "./components/NumberSorting";
import CLASS2CHAPTER1 from "./othertesting/CLASS2CHAPTER1";
import Ordering from "./othertesting/Ordering";
import TesingQuiz from "./othertesting/TestingQuix";
import WordGame from "./othertesting/WordGame";
import GridExerciseQuiz from "./othertesting/GridNumbers";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wordgame" element={<WordGame />} />
      <Route path="/grid" element={<GridExerciseQuiz />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tt" element={<TesingQuiz />} />
      <Route path="/ordering" element={<Ordering />} />
      <Route path="/cl2-ch1" element={<CLASS2CHAPTER1 />} />
      <Route path="/math-editor" element={<MathQuestionForm />} />
      <Route path="/editor" element={<EditorWithMathRenderer />} />
      <Route path="/numsort" element={<NumberSorting />} />

      <Route path="/subjects/:classId" element={<SubjectsPage />} />
      <Route
        path="/practice/:classId/:lessonId/:lessonName"
        element={<Quiz />}
      />
      <Route path="/about" element={<div>About Page</div>} />
    </Routes>
  );
}
export default App;

// https://vxl-0sy3.onrender.com/subjects/67f1096ed52c89d85988eb4a
