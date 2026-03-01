import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import SeekInputArea from '../../components/seekInputArea'
import ChatContainer from '../../components/chatContainer'
import { selectChatSessionItems, selectCurrentSessionId } from '../../redux/selectors/chatResponse'
import styles from './styles.module.scss'
import cx from 'classnames';
import { useOutletContext } from 'react-router-dom';
import _ from 'lodash';

const PROMPTS = [
  "What happens when 'Seek Not Available' appears on assets?",
  "What happens when auto-sync is not working for data sources?",
  "What should I do to add custom fonts to collections?"
]

function SupportChatbot() {
  const { newChat, setNewChat, showEvaluate } = useOutletContext();
  const [inputAtBottom, setInputAtBottom] = useState(newChat)
  const [promptMessage, setPromptMessage] = useState(null)
  const chatScrollRef = useRef(null)
  const chatSessionItems = useSelector(selectChatSessionItems)
  const sessionId = useSelector(selectCurrentSessionId) || crypto.randomUUID();

  const lastItem = chatSessionItems?.length > 0 ? chatSessionItems[chatSessionItems.length - 1] : null
  const lastItemAnswerLoaded = lastItem && !lastItem._pending && lastItem.answer?.coaching_guidance

  useEffect(() => {
    if (!chatScrollRef.current || !chatSessionItems?.length) return
    const el = chatScrollRef.current
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom)
    })
  }, [chatSessionItems?.length, lastItemAnswerLoaded])

  useEffect(() => {
    if (!newChat && inputAtBottom) {
      setTimeout(() => {
        setInputAtBottom(false)
      }, 100)
    }
  }, [newChat, inputAtBottom])

  return (
    <div className={cx(styles.supportChatbotContainer, 
    inputAtBottom && styles.inputAtBottom, 
    showEvaluate && _.size(chatSessionItems) > 0 && styles.showEvaluate,
    chatSessionItems?.length === 0 && styles.showPrompts)}>
      <div className={styles.promptsWrapper}>
        {chatSessionItems?.length === 0 && (
          <div className={styles.promptsContainer}>
            <div className={styles.promptList}>
              {PROMPTS.map((prompt, index) => (
                <span
                  key={index}
                  className={styles.promptButton}
                  onClick={() => {
                    setPromptMessage(prompt)
                  }}
                >
                  / {prompt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={chatScrollRef} className={styles.chatSessionContainer}>
        {chatSessionItems?.length > 0 && <ChatContainer />}
      </div>
      
      <div className={cx(styles.inputContainer, showEvaluate && styles.adjustedInputContainer)}>
        <SeekInputArea
          onFormSubmit={() => {
            setInputAtBottom(true)
            setNewChat(true)
            setPromptMessage?.('')
          }}
          promptMessage={promptMessage}
          setPromptMessage={setPromptMessage}
          sessionId={sessionId}
        />
      </div>
    </div>
  )
}

export default SupportChatbot
