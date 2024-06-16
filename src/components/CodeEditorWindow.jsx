import React, { useState } from "react";

import Editor from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <Box
      className="overlay"
      borderRadius="md"
      overflow="hidden"
      width="100%"
      height="100%"
      boxShadow="4xl"
    >
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </Box>
  );
};
export default CodeEditorWindow;
