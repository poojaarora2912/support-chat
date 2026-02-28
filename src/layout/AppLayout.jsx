import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Paperflite Support Chatbot

        <div><i className="fa-solid fa-right-from-bracket" /> </div>
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
