import React from "react";
import styles from "./RecommendationPanel.module.css";

// Props allow this panel to be reused for different recommendations
interface RecommendationPanelProps {
  pathName: string; // e.g., "Explorer Path"
  secondPathName?: string; // Second recommended path
  pathLink?: string; // Optional link for the main path
  onGetStarted: () => void; // function to call when button is clicked
  onSecondPathSelected?: () => void; // function to call when second path is selected
  userName?: string; // Add user's name for personalization
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  pathName,
  secondPathName,
  pathLink,
  onGetStarted,
  onSecondPathSelected,
  userName,
}) => (
  <div className={styles.panel}>
    <h2>
      🎉 <b>Congratulations!</b> 🎉
    </h2>
    <p>Thank you so much for your interest{userName ? `, ${userName}` : ''}! Below you&apos;ll find our recommendation and hopefully we&apos;ll see you in the community chats and online.</p>
    <p className={styles.path}>
      🌟 <span className={styles.highlight}>{pathName}</span> 🌟
    </p>
    {pathLink ? (
      <a href={pathLink} className={styles.getStartedBtn}>
        Get Started 🚀
      </a>
    ) : (
      <button className={styles.getStartedBtn} onClick={onGetStarted}>
        Get Started 🚀
      </button>
    )}

    {secondPathName && (
      <div className={styles.secondPath}>
        <p>We also think you might be interested in:</p>
        <p className={styles.path}>
          <span className={styles.highlight}>{secondPathName}</span>
        </p>
        {onSecondPathSelected && (
          <button
            className={`${styles.getStartedBtn} ${styles.secondaryBtn}`}
            onClick={onSecondPathSelected}
          >
            Explore This Path
          </button>
        )}
      </div>
    )}

    <p className={styles.thanks}>
      We hope this gives you a bit of guidance toward areas where you can have the quickest success. We look forward to hearing about what you build with Andromeda!
    </p>
    <h3>WELCOME TO ANDROMEDA 🎉</h3>
  </div>
);

export default RecommendationPanel;
