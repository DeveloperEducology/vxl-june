import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SubjectsPage from "./pages/SubjectsPage";
import Quiz from "./pages/Quiz";
import MathQuestionForm from "./components/editor/MathQuestionForm";
import EditorWithMathRenderer from "./components/editor/EditorWithMathRenderer";
import NumberSorting from "./components/NumberSorting";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
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