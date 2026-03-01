import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, FormControl, FormGroup, InputGroup } from "react-bootstrap";

import { fetchChatResponse } from "../../redux/actions/chatResponse";
import cx from "classnames";
import styles from './styles.module.scss';

export default function SeekInputArea({ onFormSubmit, sessionId, promptMessage, setPromptMessage }) {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [value, setValue] = useState("");

  const handleSubmit = (messageToSend) => {
    const message = (messageToSend).trim();
    if (message) {
      onFormSubmit?.();
      dispatch(fetchChatResponse({ message: message, sessionId: sessionId }));
      setValue("");
      setPromptMessage?.("");
    }
  };

  return (
    <div
      className={cx(styles.seekInputArea, {
      })}
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <InputGroup>
            <FormControl
              as="textarea"
              style={{ resize: "none" }}
              type="text"
              value={value || promptMessage}
              ref={inputRef}
              disabled={false}
              className={styles.inputField}
              placeholder={"What are you looking for?"}
              onChange={(e) => {
                const text = e.target.value;
                setValue(text);
                if (text === "" && promptMessage) setPromptMessage?.("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if(value){
                    handleSubmit(value);
                  } else {
                    handleSubmit(promptMessage || '');
                  }
                }
              }}
            />
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if(value){
                  handleSubmit(value);
                } else {
                  handleSubmit(promptMessage || '');
                }
              }}
            >
            <i className={cx("fa-solid fa-long-arrow-right", styles.seekSendIcon)} />
            </Button>
          </InputGroup>
        </FormGroup>
      </form>
    </div>
  );
}