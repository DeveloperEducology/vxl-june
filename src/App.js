import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SubjectsPage from "./pages/SubjectsPage";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
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