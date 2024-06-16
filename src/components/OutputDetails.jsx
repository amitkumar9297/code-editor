import { Text, VStack } from "@chakra-ui/react";
import React from "react";

const OutputDetails = ({ outputDetails }) => {
  return (
    <VStack mt={4} gap={3} alignItems={"flex-start"} w={"100%"}>
      <Text fontsize={"sm"}>
        Status:{" "}
        <span
          style={{
            fontWeight: "600",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          {outputDetails?.status?.description}
        </span>
      </Text>
      <Text fontsize={"sm"}>
        Memory:{" "}
        <span
          style={{
            fontWeight: "600",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          {outputDetails?.memory}
        </span>
      </Text>
      <Text fontsize={"sm"}>
        Time:{" "}
        <span
          style={{
            fontWeight: "600",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          {outputDetails?.time}
        </span>
      </Text>
    </VStack>
  );
};

export default OutputDetails;
