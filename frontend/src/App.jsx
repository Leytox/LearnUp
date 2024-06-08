import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/Information/About/About.jsx";
import Contact from "./pages/Information/Contacts/Contacts.jsx";
import Help from "./pages/Information/Help/Help.jsx";
import Login from "./pages/Auth/Login/Login.jsx";
import SignUp from "./pages/Auth/SignUp/SignUp.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Profile from "./pages/Profiles/Profile/Profile.jsx";
import Courses from "./pages/Course/Courses/Courses.jsx";
import Partners from "./pages/Information/Partners/Partners.jsx";
import CourseDetail from "./pages/Course/CourseDetail/CourseDetail.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import CreateCourse from "./pages/Course/CreateCourse/CreateCourse.jsx";
import CreateLesson from "./pages/Lesson/CreateLesson/CreateLesson.jsx";
import Lesson from "./pages/Lesson/Lesson.jsx";
import EditCourse from "./pages/Course/EditCourse/EditCourse.jsx";
import UserProfile from "./pages/Profiles/UserProfile/UserProfile.jsx";
import CreateQuiz from "./pages/Quiz/CreateQuiz/CreateQuiz.jsx";
import CreateCategory from "./pages/Category/CreateCategory/CreateCategory.jsx";
import EditCategory from "./pages/Category/EditCategory/EditCategory.jsx";
import EditQuiz from "./pages/Quiz/EditQuiz/EditQuiz.jsx";
import PassQuiz from "./pages/Quiz/PassQuiz.jsx";
import EditLesson from "./pages/Lesson/EditLesson/EditLesson.jsx";
import Enrollments from "./pages/Enrollments/Enrollments.jsx";

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
        <Route path={"/profile/:id"} element={<UserProfile />} />
        <Route path={"/courses"} element={<Courses />} />
        <Route path={"/courses/:courseId"} element={<CourseDetail />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/create-course"} element={<CreateCourse />} />
        <Route path={"/course/:courseId/edit"} element={<EditCourse />} />
        <Route
          path={"/course/:courseId/create-lesson"}
          element={<CreateLesson />}
        />
        <Route
          path={"/course/:courseId/lesson/:lessonId/edit"}
          element={<EditLesson />}
        />
        <Route
          path={"/course/:courseId/lesson/:lessonId"}
          element={<Lesson />}
        />
        <Route
          path={"/course/:courseId/lesson/:lessonId/quiz/:quizId"}
          element={<PassQuiz />}
        />
        <Route
          path={"/course/:courseId/lesson/:lessonId/create-quiz"}
          element={<CreateQuiz />}
        />
        <Route
          path={"/course/:courseId/lesson/:lessonId/quiz/:quizId/edit"}
          element={<EditQuiz />}
        />
        <Route path={"/admin"} element={<Admin />} />
        <Route path={"/admin/categories/create"} element={<CreateCategory />} />
        <Route path={"/admin/categories/:id/edit"} element={<EditCategory />} />
        <Route path={"/my-courses"} element={<Enrollments />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
