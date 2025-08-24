import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizExam = () => {
    const navigate = useNavigate();
  const styles = {
    quizExamContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '36px',
      color: '#333'
    },
    card: {
      backgroundColor: '#e8efe0',
      borderRadius: '8px',
      padding: '40px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
      minHeight: '300px',
      borderTop: '5px solid #4a874a',
       
    },
    iconContainer: {
      marginBottom: '15px'
    },
    icon: {
      backgroundColor: '#e8efe0',
      width: '70px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: '40px',
      fontWeight: 'bold',
      color: '#565656',
      margin: '0'
    }
  };

  return (
    <div style={styles.quizExamContainer}>
      <h1 style={styles.title}>Exams & Quizes Details</h1>
      
      <div style={styles.card} onClick={() => navigate('/exams')}>
        <div style={styles.iconContainer}>
          <div style={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5D5D5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>
        <h2 style={styles.cardTitle}>Exams</h2>
      </div>
      
      <div style={styles.card } onClick={() => navigate('/quizes')}>
        <div style={styles.iconContainer}>
          <div style={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5D5D5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
        </div>
        <h2 style={styles.cardTitle}>Quizes</h2>
      </div>
    </div>
  );
};

export default QuizExam;