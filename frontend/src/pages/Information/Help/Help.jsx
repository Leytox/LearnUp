import AccordionItem from "../../../components/Accordion/Accordion.jsx";
import { Helmet } from "react-helmet";
import "./Help.css";

export default function Help() {
  return (
    <div className={"help-container main-wrapper"}>
      <Helmet>
        <title>Help</title>
      </Helmet>
      <h1>Help</h1>
      <p>Welcome to the help page!</p>
      <div className={"accordions-container"}>
        <AccordionItem title="Question 1">Answer 1</AccordionItem>
        <AccordionItem title="Question 2">Answer 2</AccordionItem>
        <AccordionItem title="Question 3">Answer 3</AccordionItem>
        <AccordionItem title="Question 4">Answer 4</AccordionItem>
        <AccordionItem title="Question 5">Answer 5</AccordionItem>
        <AccordionItem title="Question 6">Answer 6</AccordionItem>
      </div>
    </div>
  );
}
