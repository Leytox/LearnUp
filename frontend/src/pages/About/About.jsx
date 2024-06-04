import React from "react";
import { Helmet } from "react-helmet";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <Helmet>
        <title>About</title>
      </Helmet>
      <h1>About Us</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
        ultrices massa, et venenatis ipsum ultrices at. Vivamus suscipit
        fermentum ante, eu dignissim orci feugiat non. Donec lacinia, lorem sit
        amet vestibulum mollis, enim orci porttitor ipsum, sed pharetra mi
        lectus a nunc. In hac habitasse platea dictumst.
      </p>
      <h2>Our Mission</h2>
      <p>
        Quisque sagittis purus quis lorem sollicitudin, et sollicitudin erat
        tincidunt. Cras purus neque, elementum a mollis eu, finibus non nulla.
        Proin maximus nisl ac metus ultricies, a faucibus arcu pellentesque.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas.
      </p>
      <h2>Our Team</h2>
      <p>
        Sed in sem et elit pharetra tincidunt. Curabitur et diam tristique,
        pellentesque elit id, cursus dui. Suspendisse potenti. Sed at eros quis
        justo fermentum varius at eu leo. Sed et elementum nisl, in facilisis
        libero.
      </p>
    </div>
  );
}
