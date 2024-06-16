import React from "react";
import { Box, Text, Link, Flex, useColorModeValue } from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <>
      <Box
        bg={bgColor}
        color={textColor}
        py={"0.2rem"}
        mt="-0.3rem"
        h={"1.5rem"}
      >
        <Flex align="center" justify="space-around" direction="row" h={"100%"}>
          <Text m={0} py={"0.2rem"} fontSize={"0.5rem"}>
            Amit Kumar
          </Text>
          <Link href="https://www.linkedin.com/in/amitkumar9297" isExternal>
            <Flex align="center">
              <FaLinkedin size="0.8em" />
              <Text ml={2}>LinkedIn</Text>
            </Flex>
          </Link>
        </Flex>
      </Box>
    </>
  );
};

export default Footer;
