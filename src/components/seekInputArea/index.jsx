import React, { useRef, useState } from "react";
import cx from "classnames";
import styles from './styles.module.scss';
import { Button, FormControl, FormGroup, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatResponse } from "../../redux/actions/chatResponse";

export default function SeekInputArea({ onFormSubmit, sessionId, promptMessage, setPromptMessage }) {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [value, setValue] = useState("");

  const chatResponse = useSelector((state) => state.chatResponse);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const messageToSend = (value).trim();
    if (messageToSend) {
      onFormSubmit?.();
      dispatch(fetchChatResponse({ message: messageToSend, sessionId: sessionId }));
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
              value={value}
              ref={inputRef}
              disabled={false}
              className={styles.inputField}
              placeholder={"What are you looking for?"}
              onChange={(e) => {
               setValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              type="submit"
            >
            <i className={cx("fa-solid fa-long-arrow-right", styles.seekSendIcon)} />
            </Button>
          </InputGroup>
        </FormGroup>
      </form>
    </div>
  );
}