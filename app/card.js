import { useState } from "react";
import styles from "./page.module.css";

export default function Card({ card, title, id }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.card}>
    <div className={styles.cardTop}>
    <button className={styles.leftAddBtn}> {"<--"} </button>
    <h3>{card.title}</h3>
    <button className={styles.rightAddBtn}> {"-->"} </button>
    </div>
    <button className={styles.bottomAddBtn}> {"v"} </button>
    </div>
  );
}