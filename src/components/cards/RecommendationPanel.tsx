import React from "react";
import styles from "./RecommendationPanel.module.css";

// Props allow this panel to be reused for different recommendations
interface RecommendationPanelProps {
    pathName: string; // e.g., "Explorer Path"
    onGetStarted: () => void; // function to call when button is clicked
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ pathName, onGetStarted }) => (
    <div className={styles.panel}>
        <h2>
            🎉 <b>Congratulations!</b> 🎉
        </h2>
        <p>Based on your responses, we recommend the:</p>
        <p className={styles.path}>
            🌟 <span className={styles.highlight}>{pathName}</span> 🌟
        </p>
        <button className={styles.getStartedBtn} onClick={onGetStarted}>
            Get Started 🚀
        </button>
        <p className={styles.thanks}>
            Thank you for completing the onboarding process!
        </p>
        <h3>
            WELCOME TO ANDROMEDA 🎉
        </h3>
    </div>
);

export default RecommendationPanel; 