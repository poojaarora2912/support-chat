import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './AppLayout.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { LOGOUT_USER } from '../constants/actionTypes';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const activatedTab = useSelector((state) => state.selection.activatedTab) || null;
  const isEvaluationPage = location.pathname === '/evaluation';
  
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [currentTab, setCurrentTab] = useState('');

  const isIntercomConversation = (url)  => {
    return url.includes('https://app.intercom.com/a/inbox/') && url.includes('conversation/');
  }

  const handleLogout = () => {
    dispatch({type: LOGOUT_USER});
    navigate('/login');
  }

  const handleEvaluate = () => {
    navigate('/evaluation');
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

        <div className={styles.logoutButton} onClick={handleLogout}><i className="fa-solid fa-right-from-bracket" /> </div>
      </div>
      {showEvaluate && !isEvaluationPage && (
        <div className={styles.evaluationContainer} onClick={handleEvaluate}>
          Evaluate your chat <i className="fa-solid fa-arrow-right" />
        </div>
      )}
    <div className={styles.content}>
      <Outlet />
    </div>
  </div>
);
}
