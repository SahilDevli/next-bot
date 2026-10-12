"use client";
import { useState } from "react";
import styles from "./counter.module.scss";

export default function(){
    const [counter, setCounter] = useState(0);
    return(
        <div className={styles.counter}>

            <h4 className={styles.heading}>counter</h4>

            <div className={styles.count}>{counter}</div>

            <div className={styles.buttons}>
                <button className= {styles.cntBtn} onClick={ ()=>setCounter(prev => prev-1) } >-</button>
                <button className={styles.cntBtn} onClick={ ()=>setCounter(counter+1) } >+</button>
            </div>

            <button className={styles.cntBtn} onClick={()=>{setCounter(0)}}>reset</button>

        </div>
    );
}