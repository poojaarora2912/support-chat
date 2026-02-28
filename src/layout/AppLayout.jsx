import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function AppLayout() {
  const activatedTab = useSelector((state) => state.selection.activatedTab) || null;
  
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [currentTab, setCurrentTab] = useState('');

  const isIntercomConversation = (url)  => {
    return url.includes('https://app.intercom.com/a/inbox/') && url.includes('conversation/');
  }

  useEffect(() => {
    if (!activatedTab?.url || activatedTab.url === currentTab) return;
    setCurrentTab(activatedTab.url);
    setShowEvaluate(isIntercomConversation(activatedTab.url));
  }, [activatedTab, currentTab]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Paperflite Support Chatbot

        <div><i className="fa-solid fa-right-from-bracket" /> </div>
      </div>
      {showEvaluate && <div className={styles.evaluationContainer}>
        Evaluate your chat <i className="fa-solid fa-arrow-right" />
      </div>}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
