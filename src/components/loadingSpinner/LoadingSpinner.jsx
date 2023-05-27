import { Spinner } from "@chakra-ui/react";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div styles={styles.container}>
      <Spinner size="xl" />
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 100,
  },
};

export default LoadingSpinner;
