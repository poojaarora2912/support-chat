  import { Outlet } from 'react-router-dom';
  import styles from './AppLayout.module.scss';
  import { useDispatch, useSelector } from 'react-redux';
  import { useEffect, useState } from 'react';
  import cx from 'classnames';
  import { OverlayTrigger, Tooltip } from "react-bootstrap";
  import SupportChatbot from '../pages/chatbot';
import { invalidateChatResponse } from '../redux/actions/chatResponse';

  export default function AppLayout() {
    const dispatch = useDispatch();

    const activatedTab = useSelector((state) => state.selection.activatedTab) || null;
    
    const [showEvaluate, setShowEvaluate] = useState(false);
    const [currentTab, setCurrentTab] = useState('');
    const [newChat, setNewChat] = useState(false);

    const isIntercomConversation = (url)  => {
      return url.includes('https://app.intercom.com/a/inbox/') && url.includes('conversation/');
    }

    useEffect(() => {
      if (!activatedTab?.url || activatedTab.url === currentTab) return;
      setCurrentTab(activatedTab.url);
      setShowEvaluate(isIntercomConversation(activatedTab.url));
    }, [activatedTab, currentTab]);

    const handleNewChat = () => {
      setNewChat(false);
      dispatch(invalidateChatResponse());
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Paperflite Support Chatbot</span>
          <div className={styles.headerActions}>
            <div className={styles.actionButtons}>
              {newChat && <div className={styles.actionButton} onClick={() => handleNewChat()}><i className={cx(styles.actionButtonIcon, "fa-solid fa-plus")} />New Chat</div>}
            </div>
            <div className={styles.logoutButton}>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="logout-tooltip">Logout</Tooltip>}>
              <i className="fa-solid fa-right-from-bracket" />
            </OverlayTrigger>
          </div>
          </div>
        </div>
        {showEvaluate && <div className={styles.evaluationContainer}>
          Evaluate your chat <i className={cx(styles.evaluationArrow, "fa-solid fa-arrow-right")} />
        </div>}
        <div className={styles.content}>
          <SupportChatbot newChat={newChat} setNewChat={setNewChat} />
        </div>
      </div>
    );
  }
