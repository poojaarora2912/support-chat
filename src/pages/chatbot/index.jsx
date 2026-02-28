import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import SeekInputArea from '../../components/seekInputArea'
import ChatContainer from '../../components/chatContainer'
import { selectChatSessionItems, selectCurrentSessionId } from '../../redux/selectors/chatResponse'
import styles from './styles.module.scss'
import cx from 'classnames';

const PROMPTS = [
  "What happens when 'Seek Not Available' appears on assets?",
  "What happens when auto-sync is not working for data sources?",
  "What should I do to add custom fonts to collections?"
]

function SupportChatbot({newChat, setNewChat}) {
  const [inputAtBottom, setInputAtBottom] = useState(newChat)
  const [promptMessage, setPromptMessage] = useState(null)
  const chatScrollRef = useRef(null)
  const chatSessionItems = useSelector(selectChatSessionItems)
  const sessionId = useSelector(selectCurrentSessionId) || crypto.randomUUID();

  useEffect(() => {
    if (chatScrollRef.current && chatSessionItems?.length > 0) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatSessionItems?.length])

  useEffect(() => {
    if (!newChat && inputAtBottom) {
      setTimeout(() => {
        setInputAtBottom(false)
      }, 100)
    }
  }, [newChat, inputAtBottom])

  return (
    <div className={cx(styles.supportChatbotContainer, inputAtBottom && styles.inputAtBottom, chatSessionItems?.length === 0 && styles.showPrompts)}>
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
                    setNewChat(true)
                    onFormSubmit()
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
      
      <div className={styles.inputContainer}>
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
