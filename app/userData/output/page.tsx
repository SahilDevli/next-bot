"use client";
import Link from "next/link";
import styles from "@/app/userData/user.module.scss";
import { useUserContext } from "@/src/context/useerContext";

export default function UserData() {
    const { user } = useUserContext();

    return (
        <>
             <Link className={styles.cntBtn} href="/userData/input">
                Input
            </Link>

            <div className="userdata">
                <p>Name: {user.name}</p>
                <p>Age: {user.age}</p>
            </div>
        </>
    );
}