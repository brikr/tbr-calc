import { HTMLAttributes } from "react";
import styles from "./button.module.scss";

interface Props extends HTMLAttributes<HTMLButtonElement> {}

export function Button(props: Props) {
  return <button {...props} className={styles.button}></button>;
}
