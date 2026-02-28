import React, { useRef, useState } from "react";
import cx from "classnames";
import styles from './styles.module.scss';
import { Button, FormControl, FormGroup, InputGroup } from "react-bootstrap";

export default function SeekInputArea(props) {
  const inputRef = useRef(null);

  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (value.trim()) {
      props.onFormSubmit?.();
      setValue("");
    }
  };

  return (
    <div
      className={cx(styles.seekInputArea, props.className, {
        // [styles.disableSearchBar]: props.disabled,
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
              placeholder={"Enter here"}
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
            {/* {!props.placeholder && (
              <div
                className={styles.placeholder}
                onClick={() => {
                  if (!props.disabled) {
                    inputRef.current.focus();
                  }
                }}
              >
             
              </div>
            )} */}
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