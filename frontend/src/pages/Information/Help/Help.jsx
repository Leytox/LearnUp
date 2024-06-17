import AccordionItem from "../../../components/Accordion/Accordion.jsx";
import { Helmet } from "react-helmet";
import "./Help.css";
import { useTranslation } from "react-i18next";

export default function Help() {
  const { t } = useTranslation();
  return (
    <div className={"help-container main-wrapper"}>
      <Helmet>
        <title>{t("help")}</title>
      </Helmet>
      <h1>{t("help")}</h1>
      <p>{t("welcomeHelp")}</p>
      <div className={"accordions-container"}>
        <AccordionItem title="1. What types of courses does LearnUp offer?">
          LearnWise offers a wide range of courses across various fields,
          including technology, business, personal development, arts, and
          sciences. Our courses are designed to cater to different skill levels,
          from beginners to advanced learners.
        </AccordionItem>
        <AccordionItem title="2. How do I enroll in a course?">
          Enrolling in a course is easy. Simply create an account on our
          platform, browse our course catalog, and select the course you are
          interested in. Click the &quot;Enroll&quot; button and follow the
          instructions to complete the enrollment process.
        </AccordionItem>
        <AccordionItem title="3. Can I learn at my own pace?">
          Yes, all of our courses are designed to be self-paced. You can access
          the course materials at any time and progress through the lessons at
          your own speed, making it convenient to fit learning into your
          schedule.
        </AccordionItem>
        <AccordionItem title="4. Are there any prerequisites for taking a course?">
          Some courses may have prerequisites, which will be clearly listed in
          the course description. If you are unsure whether you meet the
          requirements, you can contact our support team for guidance.
        </AccordionItem>
        <AccordionItem title="5. Will I receive a certificate upon course completion?">
          Yes, upon successfully completing a course, you will receive a digital
          certificate of completion. This certificate can be shared on your
          resume, LinkedIn profile, or with your employer to showcase your newly
          acquired skills.
        </AccordionItem>
        <AccordionItem title="6. What kind of support is available if I have questions during the course?">
          We offer multiple support options to assist you during your learning
          journey. You can reach out to our support team via email or live chat
          for any technical issues or course-related questions. Additionally,
          many courses include discussion forums where you can interact with
          instructors and fellow learners.
        </AccordionItem>
      </div>
    </div>
  );
}
