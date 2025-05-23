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
}

// Path color mapping based on designer specifications
const getPathColor = (pathName: string): string => {
  const colorMap: Record<string, string> = {
    "AI Navigator": "#f7d6eb", // Purple/pink from designer
    "AI Navigators": "#f7d6eb",
    Explorer: "#f9edd7", // Beige/tan from designer
    Explorers: "#f9edd7",
    Contractor: "#bde8f0", // Light blue from extended palette (#bde8f0)
    Contractors: "#bde8f0",
    Hacker: "#b6f7d2", // Light green from extended palette (#b6f7d2)
    Hackers: "#b6f7d2",
    Visionary: "#e6c9ff", // Light purple from extended palette (#cbbbe5)
    Visionaries: "#e6c9ff",
    Ambassador: "#ffd6b3", // Light orange from extended palette (#f0d1cc)
    Ambassadors: "#ffd6b3",
    // Additional colors from the extended palette
    "Data Scientist": "#dcfaf5", // Light teal (#dcfaf5)
    Designer: "#f0e5ff", // Light lavender (#f0e5ff)
    Marketing: "#ffe5d1", // Light peach (#ffe5d1)
    Community: "#d1f5e3", // Light mint (#d1f5e3)
  };
  return colorMap[pathName] || "#f0f0f0"; // Default gray if path not found
};

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  pathName,
  pathDescription,
  secondPathName,
  secondPathDescription,
  pathLink,
  onGetStarted,
  onSecondPathSelected,
}) => {
  const primaryColor = getPathColor(pathName);
  const secondaryColor = secondPathName
    ? getPathColor(secondPathName)
    : undefined;

  return (
    <div className={styles.recommendationContent}>
      {/* Horizontal card layout */}
      <div className={styles.pathCards}>
        {/* Primary Path Card */}
        <div
          className={styles.pathCard}
          style={{ backgroundColor: primaryColor }}
        >
          <div className={styles.pathCardHeader}>
            <h3 className={styles.pathName}>{pathName}</h3>
            <div className={styles.cardIcon}></div>
          </div>
          <div className={styles.pathCardContent}>
            {pathDescription && (
              <p className={styles.pathDescription}>{pathDescription}</p>
            )}
            {pathLink ? (
              <a href={pathLink} className={styles.selectButton}>
                Select and Start
              </a>
            ) : (
              <button className={styles.selectButton} onClick={onGetStarted}>
                Select and Start
              </button>
            )}
          </div>
        </div>

        {/* Secondary Path Card */}
        {secondPathName && secondaryColor && (
          <div
            className={styles.pathCard}
            style={{ backgroundColor: secondaryColor }}
          >
            <div className={styles.pathCardHeader}>
              <h3 className={styles.pathName}>{secondPathName}</h3>
              <div className={styles.cardIcon}></div>
            </div>
            <div className={styles.pathCardContent}>
              {secondPathDescription && (
                <p className={styles.pathDescription}>
                  {secondPathDescription}
                </p>
              )}
              {onSecondPathSelected && (
                <button
                  className={styles.selectButton}
                  onClick={onSecondPathSelected}
                >
                  Select and Start
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Indicator dots */}
      <div className={styles.indicators}>
        <div className={styles.dot}></div>
        <div className={`${styles.dot} ${styles.activeDot}`}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default RecommendationPanel;
