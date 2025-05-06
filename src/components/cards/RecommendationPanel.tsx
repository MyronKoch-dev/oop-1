import React from "react";
import styles from "./RecommendationPanel.module.css";

// Props allow this panel to be reused for different recommendations
interface RecommendationPanelProps {
  pathName: string; // e.g., "Explorer Path"
  secondPathName?: string; // Second recommended path
  onGetStarted: () => void; // function to call when button is clicked
  onSecondPathSelected?: () => void; // function to call when second path is selected
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  pathName,
  secondPathName,
  onGetStarted,
  onSecondPathSelected,
}) => (
  <div className={styles.panel}>
    <h2>
      🎉 <b>Congratulations!</b> 🎉
    </h2>
    <p>Based on your responses, we recommend the following paths:</p>
    <p className={styles.path}>
      🌟 <span className={styles.highlight}>{pathName}</span> 🌟
    </p>
    <button className={styles.getStartedBtn} onClick={onGetStarted}>
      Get Started 🚀
    </button>

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
      Thank you for completing the onboarding inquiry process! We hope this gives you a bit of guidance toward areas which you can have the quickest success. We look forward to hearing about what you build with Andromeda!
    </p>
    <h3>WELCOME TO ANDROMEDA 🎉</h3>
  </div>
);

export default RecommendationPanel;
