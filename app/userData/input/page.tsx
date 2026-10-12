"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "@/app/userData/user.module.scss";
import { useUserContext } from "@/src/context/useerContext";

export default function UserData() {
    const { setUser } = useUserContext();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");

    function setUserData() {
        setUser({
            name: name,
            age: age,
        });
    }

    return (
        <>
        <br />
        <br />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
            <br /><br />

            <button
                className={styles.cntBtn}
                onClick={setUserData}
            >
                set user
            </button>
            {/* <br /> */}
            <Link className={styles.cntBtn} href="/userData/output">
                Output
            </Link>
        </>
    );
}