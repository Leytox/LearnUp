import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Contact from "./pages/Contacts/Contacts.jsx";
import Help from "./pages/Help/Help.jsx";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Courses from "./pages/Courses/Courses.jsx";
import Partners from "./pages/Partners/Partners.jsx";
import CourseDetail from "./pages/CourseDetail/CourseDetail.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import CreateCourse from "./pages/CreateCourse/CreateCourse.jsx";
import CreateLesson from "./pages/CreateLesson/CreateLesson.jsx";
import CreateQuizz from "./pages/CreateQuizz/CreateQuizz.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route index path={"/"} element={<Home />} />
        <Route path={"/about"} element={<About />} />
        <Route path={"/about/partners"} element={<Partners />} />
        <Route path={"/contact"} element={<Contact />} />
        <Route path={"/help"} element={<Help />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path={"/courses"} element={<Courses />} />
        <Route path={"/create-course"} element={<CreateCourse />} />
        <Route
          path={"/course/:courseId/create-lesson"}
          element={<CreateLesson />}
        />
        <Route
          path={"/course/:courseId/:lessonId/create-quizz"}
          element={<CreateQuizz />}
        />
        <Route path={"/courses/:courseId"} element={<CourseDetail />} />
        <Route
          path={"/courses/:courseId/lesson/:lessonId"}
          element={<div>Lesson</div>}
        />

        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/admin"} element={<Admin />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
