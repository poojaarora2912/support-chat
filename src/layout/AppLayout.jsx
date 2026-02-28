import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_USER } from '../constants/actionTypes';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({type: LOGOUT_USER});
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Paperflite Support Chatbot

        <div className={styles.logoutButton} onClick={handleLogout}><i className="fa-solid fa-right-from-bracket" /> </div>
      </div>
      <div className={styles.evaluationContainer}>
        Evaluate your chat <i className="fa-solid fa-arrow-right" />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
