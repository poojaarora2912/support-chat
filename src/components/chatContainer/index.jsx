import { useSelector } from "react-redux";
import { selectChatSessionItems } from "../../redux/selectors/chatResponse";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

const LOADING_PLACEHOLDER_MESSAGES = [
  "Engineering is working behind the scenes to support you...",
  "Powered by engineering. Fueled by caffeine...",
  "Loading… because good things take milliseconds...",
  "Sometimes the best debugging step is a hard refresh...",
  "Engineering built this for you — show them some love...",
  "If something feels off, try a hard refresh first...",
  "Turning questions into answers...",
  "Built with care, loading with purpose...",
];
export default function ChatContainer() {
  const chatSessionItems = useSelector(selectChatSessionItems);

  return (
    <div className={styles.chatContainer}>
      {chatSessionItems?.map((item, index) => (
        <ChatSessionItem
          key={item._pending ? "pending" : (item.id ?? index)}
          item={item}
        />
      ))}
    </div>
  );
}

const ChatSessionItem = ({ item }) => {
  const isPendingAnswer = Boolean(item._pending);

  const [msgIndex, setMsgIndex] = useState(() =>
    Math.floor(Math.random() * LOADING_PLACEHOLDER_MESSAGES.length),
  );

  useEffect(() => {
    if (!isPendingAnswer) return;
    const interval = setInterval(() => {
      setMsgIndex(() =>
        Math.floor(Math.random() * LOADING_PLACEHOLDER_MESSAGES.length),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isPendingAnswer]);

  return (
    <div className={styles.chatSessionItem}>
      <div className={styles.query}>{item.query || "No query"}</div>
      <div className={styles.answerContainer}>
        <div className={styles.answerHeaderWrapper}>
          <div className={styles.answerHeader}>Response</div>
          <div className={styles.divider} />
        </div>
        {isPendingAnswer ? (
          <div className={styles.loadingPlaceholder}>{LOADING_PLACEHOLDER_MESSAGES[msgIndex]}</div>
        ) : (
          <div className={styles.answer}>
            {item.answer?.coaching_guidance || "No answer"}
          </div>
        )}
      </div>
    </div>
  );
};
