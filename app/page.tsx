import Link from "next/link";
import styles from "./app.module.scss";

export default function Home() {
  return (
    <nav className={styles.navigation}>

      <Link className={styles.cntBtn} href="/practice">
        counter
      </Link>

      <Link className={styles.cntBtn} href="/userData/input">
        Context api
      </Link>

      <Link className={styles.cntBtn} href="/authentication/signin">
        Sign In
      </Link>

      <Link className={styles.cntBtn} href="/enma">
        enma
      </Link>

    </nav>
  );
}