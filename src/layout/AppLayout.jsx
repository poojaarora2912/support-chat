import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { invalidateChatResponse } from '../redux/actions/chatResponse';
import { LOGOUT_USER } from '../constants/actionTypes';

import cx from 'classnames';
import _ from 'lodash';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isEvaluationPage = location.pathname === '/evaluation';

  const activatedTab = useSelector((state) => state.selection.activatedTab) || null;

  const [showEvaluate, setShowEvaluate] = useState(false);
  const [currentTab, setCurrentTab] = useState('');
  const [newChat, setNewChat] = useState(false);

  const isIntercomConversation = (url) => {
    return url.includes('https://app.intercom.com/a/inbox/') && url.includes('conversation/');
  };

  useEffect(() => {
    if (!activatedTab?.url || activatedTab.url === currentTab) return;
    setCurrentTab(activatedTab.url);
    setShowEvaluate(isIntercomConversation(activatedTab.url));
  }, [activatedTab, currentTab]);

  const handleLogout = () => {
    dispatch({ type: LOGOUT_USER });
    navigate('/login');
  };

  const handleEvaluate = () => {
    navigate('/evaluation');
  };

  const handleNewChat = () => {
    if(_.get(location, "pathname") === '/evaluation') {
      navigate('/');
    } else {
      setNewChat(false);
      dispatch(invalidateChatResponse());
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Paperflite Support Chatbot</span>
        <div className={styles.headerActions}>
          <div className={styles.actionButtons}>
            {(newChat || isEvaluationPage) && (
              <div className={styles.actionButton} onClick={() => handleNewChat()}>
                <i className={cx(styles.actionButtonIcon, 'fa-solid fa-plus')} />
                {isEvaluationPage ? 'Continue Chat' : 'New Chat'}
              </div>
            )}
          </div>
          <div className={styles.logoutButton} onClick={handleLogout}>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="logout-tooltip">Logout</Tooltip>}>
              <span>
                <i className="fa-solid fa-right-from-bracket" />
              </span>
            </OverlayTrigger>
          </div>
        </div>
      </div>
      {showEvaluate && !isEvaluationPage && (
        <div className={styles.evaluationContainer} onClick={handleEvaluate}>
          Evaluate your chat <i className={cx(styles.evaluationArrow, 'fa-solid fa-arrow-right')} />
        </div>
      )}
      <div className={styles.content}>
        <Outlet context={{ newChat, setNewChat, showEvaluate }} />
      </div>
    </div>
  );
}
