import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as monaco from "@monaco-editor/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useKeyPress from "../hooks/useKeyPress";
import axios from "axios";

import Footer from "./Footer";
import LanguagesDropdown from "./LanguagesDropdown";
import ThemeDropdown from "./ThemeDropdown";
import { defineTheme } from "../lib/defineTheme";
import { languageOptions } from "../constants/languageOptions";
import CodeEditorWindow from "./CodeEditorWindow";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";

import {
  REACT_APP_RAPID_API_HOST,
  REACT_APP_RAPID_API_KEY,
  REACT_APP_RAPID_API_URL,
} from "../api/API";

const javascriptDefault = `/**
* JavaScript Code.
*/



console.log("Hello World");
`;

export const Landing = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("black", "white");
  const hoverBoxShadow = useColorModeValue(
    "0 0 10px rgba(0, 0, 0, 0.6)",
    "0 0 10px rgba(255, 255, 255, 0.6)"
  );

  const [theme, setTheme] = useState({
    value: "oceanic-next",
    label: "Oceanic Next",
  });
  const [language, setLanguage] = useState(languageOptions[0]);

  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);

  const [code, setCode] = useState(javascriptDefault);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

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

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
    // setTheme(th);
    // monaco.editor.setTheme(th.value);
  }

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const downloadCode = (code, filename = "code.js") => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // const importCode = (event) => {
  //   const file = event.target.files[0]; // Get the first file from the input

  //   if (file) {
  //     const reader = new FileReader(); // Create a new FileReader instance

  //     reader.onload = (e) => {
  //       const fileContent = e.target.result; // Read the file content
  //       setCode(fileContent.trim()); // Update the code state with the file content
  //     };

  //     reader.onerror = (e) => {
  //       console.error("Error reading file:", e);
  //       // Optionally show an error toast or message to the user
  //     };

  //     reader.readAsText(file); // Read the file as text
  //   }
  // };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Box
        bgGradient="linear(to-r, pink.500, red.500, yellow.500)"
        w={"100%"}
        h={"0.28rem"}
      />
      <Stack
        direction={{ base: "column", sm: "row" }}
        justifyContent={{ base: "center", sm: "flex-start" }}
        gap={"0.5rem"}
        alignItems={{ base: "center", sm: "flex-start" }}
      >
        <Box px={3} py={2}>
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </Box>
        <Box px={3} py={2}>
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </Box>
        <Box px={3} py={2}>
          <Button
            onClick={() => downloadCode(code)}
            // mt={4}
            borderWidth="2px"
            zIndex={10}
            borderRadius="md"
            px={4}
            py={2}
            // bg={"teal.500"}
            colorScheme="teal"
            transition="box-shadow 200ms"
            _hover={{ boxShadow: hoverBoxShadow }}
            width={"10rem"}
            height={"2.8rem"}
          >
            Export Code
          </Button>
        </Box>
        {/* <Box px={3} py={2}>
          <FormControl>
            <Input
              id="import-button"
              type="file"
              accept=".js,.txt,.json,.html,.css,.py,.java,.cpp,.c"
              onChange={importCode}
              display="none"
            />
            <Button
              as="label"
              htmlFor="import-button"
              colorScheme="teal"
              // mt={4}
              borderWidth="2px"
              zIndex={10}
              borderRadius="md"
              width={"10rem"}
              height={"3rem"}
              px={4}
              py={2}
            >
              Import Code
            </Button>
          </FormControl>
        </Box> */}
      </Stack>
      <Stack
        p={"4"}
        w={"100%"}
        h={"98%"}
        direction={{ base: "column", lg: "row" }}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
      >
        <VStack w={{ base: "100%", lg: "70%" }} h={{ base: "60%", lg: "100%" }}>
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </VStack>
        <VStack
          className="right-container"
          flexShrink={0}
          w={{ base: "100%", lg: "28%" }}
        >
          <OutputWindow outputDetails={outputDetails} />
          <VStack align="flex-end" spacing={4} w={"100%"}>
            {/* <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            /> */}
            <Button
              onClick={handleCompile}
              disabled={!code}
              mt={4}
              borderWidth="2px"
              // borderColor={borderColor}
              zIndex={10}
              borderRadius="md"
              // boxShadow="5px 5px 0px 0px rgba(0,0,0)"
              px={4}
              py={2}
              bg={bgColor}
              color={textColor}
              transition="box-shadow 200ms"
              _hover={{ boxShadow: hoverBoxShadow }}
              opacity={!code ? 0.5 : 1}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </Button>
          </VStack>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </VStack>
      </Stack>
      <Footer />
    </>
  );
};
