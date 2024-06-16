import React from "react";
import { classnames } from "../utils/general";
import { Textarea, useColorModeValue } from "@chakra-ui/react";

const CustomInput = ({ customInput, setCustomInput }) => {
  // const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("black", "white");

  return (
    <>
      {" "}
      <Textarea
        rows={5}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        bg={bgColor}
        color={textColor}
        outline="none"
        width="100%"
        borderWidth="2px"
        // borderColor={borderColor}
        zIndex={10}
        borderRadius="0.375rem" // equivalent to 'rounded-md' in Tailwind
        // boxShadow="5px 5px 0px 0px rgba(0,0,0)"
        p={4} // equivalent to 'px-4 py-2'
        transition="box-shadow 200ms" // equivalent to 'transition duration-200'
        mt="0.5rem" // equivalent to 'mt-2'
      />
    </>
  );
};

export default CustomInput;
