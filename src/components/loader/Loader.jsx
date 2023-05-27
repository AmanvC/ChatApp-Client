import React from "react";

const Loader = () => {
  return (
    <div style={styles}>
      <h1
        style={{
          opacity: "0.7",
        }}
      >
        Loading...
      </h1>
    </div>
  );
};

const styles = {
  fontFamily: "Work sans",
  height: "100vh",
  width: "100vw",
  background: "linear-gradient(to top right, #13547a, #80d0c7, #13547a)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "3em",
  color: "white",
};

export default Loader;
