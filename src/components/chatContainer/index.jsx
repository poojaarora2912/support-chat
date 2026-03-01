import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { selectChatSessionItems } from "../../redux/selectors/chatResponse";

import _ from "lodash";
import styles from "./styles.module.scss";
import cx from "classnames";

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
        {(() => {
          const citations = item.answer?.citations ?? [];
          const sourceTypes = [...new Set(citations.map((c) => c.source_type ?? "Other"))];
          if (sourceTypes.length === 0) return null;
          return (
            <div className={styles.sourceType}>
              Sources: {sourceTypes.join(", ")}
            </div>
          );
        })()}
        <div className={styles.supportArticles}>
        {_.size(item.support_articles) > 0 && (
            <div className={styles.helpText}>Related articles that may help you:</div>
          )}    
          {_.size(item.support_articles) > 0 && item.support_articles.map((article, index) => (
            <SupportArticles key={article.id ?? index} article={article} />
          ))}
          </div>
      </div>
    </div>
  );
};

const SupportArticles = ({ article }) => {
  return (
    <div className={styles.supportArticle}>
    <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.supportArticleLink}>
      <span className={styles.supportArticleTitle}>{article.title}</span>
    <i className={cx("fa-solid fa-arrow-up-right-from-square", styles.linkIcon)} />
    </a>
  </div>
  );
};
