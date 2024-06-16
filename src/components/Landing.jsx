import { Box, HStack, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import LanguagesDropdown from "./LanguagesDropdown";
import ThemeDropdown from "./ThemeDropdown";
import { defineTheme } from "../lib/defineTheme";
import { languageOptions } from "../constants/languageOptions";
import CodeEditorWindow from "./CodeEditorWindow";

const javascriptDefault = `/**
* JavaScript Code.
*/



console.log("Hello World");
`;

export const Landing = () => {
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const [code, setCode] = useState(javascriptDefault);

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  return (
    <>
      <Box
        bgGradient="linear(to-r, pink.500, red.500, yellow.500)"
        w={"100%"}
        h={"0.2rem"}
      />
      <HStack>
        <Box px={4} py={2}>
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </Box>
        <Box px={4} py={2}>
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </Box>
      </HStack>
      <HStack p={"4"}>
        <VStack w={"100%"} h={"100%"}>
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </VStack>
      </HStack>
      <Footer />
    </>
  );
};
