import { useState } from 'react'
import SeekInputArea from '../../components/seekInputArea'
import styles from './styles.module.scss'

function SupportChatbot() {
  const [inputAtBottom, setInputAtBottom] = useState(false)

  return (
    <div
      className={`${styles.supportChatbotContainer} ${inputAtBottom ? styles.inputAtBottom : ''}`}
    >
      <SeekInputArea onFormSubmit={() => setInputAtBottom(true)} />
    </div>
  )
}

export default SupportChatbot
