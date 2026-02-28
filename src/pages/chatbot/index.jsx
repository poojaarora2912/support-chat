import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import SeekInputArea from '../../components/seekInputArea'
import ChatContainer from '../../components/chatContainer'
import { selectChatSessionItems, selectCurrentSessionId } from '../../redux/selectors/chatResponse'
import styles from './styles.module.scss'
import cx from 'classnames';

function SupportChatbot({newChat, setNewChat}) {
  const [inputAtBottom, setInputAtBottom] = useState(newChat)
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
    <div className={cx(styles.supportChatbotContainer, inputAtBottom && styles.inputAtBottom)}>
      <div ref={chatScrollRef} className={styles.chatSessionContainer}>
        <ChatContainer />
      </div>
      <div className={styles.inputContainer}>
        <SeekInputArea onFormSubmit={() => {
          setInputAtBottom(true)
          setNewChat(true)
        }} sessionId={sessionId} />
      </div>
    </div>
  )
}

export default SupportChatbot
