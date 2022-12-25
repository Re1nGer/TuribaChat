import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (textAreaRef, value) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);

  useEffect(() => {
    if (textAreaRef) {
        if (value === '') {
            textAreaRef.style.height = '0px';
            textAreaRef.style.rows = '0';
            const scrollHeight = textAreaRef.scrollHeight;
            textAreaRef.style.height = scrollHeight + "px";
        }
    }
  }, [value]);
};

export default useAutosizeTextArea;