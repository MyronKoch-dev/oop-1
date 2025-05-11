import React from "react";
import styles from "./RecommendationPanel.module.css";

// Props allow this panel to be reused for different recommendations
interface RecommendationPanelProps {
  pathName: string;
  pathDescription?: string; // New: Explanation of the path
  secondPathName?: string;
  secondPathDescription?: string; // New: Explanation of the second path
  pathLink?: string; // Optional link for the main path
  onGetStarted: () => void; // function to call when button is clicked
  onSecondPathSelected?: () => void; // function to call when second path is selected
  userName?: string; // Add user's name for personalization
  appUrl?: string; // New: URL for the main web application
  goToAppButtonText?: string; // New: Text for the "Go to App" button
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  pathName,
  pathDescription,
  secondPathName,
  secondPathDescription,
  pathLink,
  onGetStarted,
  onSecondPathSelected,
  userName,
  appUrl,
  goToAppButtonText = "Explore Andromeda Platform", // Default button text
}) => (
  <div className={styles.panel}>
    <h2>
      🎉 <b>Congratulations!</b> 🎉
    </h2>
    <p>Welcome{userName ? `, ${userName}` : ''}! Based on your responses, here is a recommended starting path to help you make the most of Andromeda:</p>
    <p className={styles.path}>
      🌟 <span className={styles.highlight}>{pathName}</span> 🌟
    </p>
    {pathDescription && (
      <p className={styles.description}>{pathDescription}</p>
    )}
    {pathLink ? (
      <a href={pathLink} className={styles.getStartedBtn}>
        Get Started 🚀
      </a>
    ) : (
      <button className={styles.getStartedBtn} onClick={onGetStarted}>
        🚀 Get Started 🚀
      </button>
    )}

    {secondPathName && (
      <div className={styles.secondPath}>
        <p>We also think you might be interested in:</p>
        <p className={styles.path}>
          <span className={styles.highlight}>{secondPathName}</span>
        </p>
        {secondPathDescription && (
          <p className={styles.description}>{secondPathDescription}</p>
        )}
        {onSecondPathSelected && (
          <button
            className={`${styles.getStartedBtn} ${styles.secondaryBtn}`}
            onClick={onSecondPathSelected}
          >
            🚀 Explore This Path 🚀
          </button>
        )}
      </div>
    )}

    <p className={styles.thanks}>
      We hope this gives you a bit of guidance toward areas where you can have the quickest success. We look forward to hearing about what you build with Andromeda!
    </p>
    <h3> 🎉 WELCOME TO ANDROMEDA 🎉</h3>
    {appUrl && (
      <a
        href={appUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.secondaryBtn} mt-4`} // Use only secondaryBtn style + consistent top margin
      >
        {goToAppButtonText}
      </a>
    )}
  </div>
);

export default RecommendationPanel;
