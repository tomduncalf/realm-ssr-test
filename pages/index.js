import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import * as Realm from "realm-web";

export default function Home(props) {
  console.log(props);
  return (
    <div className={styles.container}>
      {props.tasks.map((t) => (
        <p>
          Task description: {t.description}. Is complete?{" "}
          {t.isComplete ? "yes" : "no"}
        </p>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const app = new Realm.App({ id: process.env.NEXT_PUBLIC_APP_ID });
  const user = await app.logIn(Realm.Credentials.anonymous());
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const tasksCollection = mongodb?.db("template").collection("Task");

  const tasks = (await tasksCollection.find()).map((t) => ({
    description: t.description,
    isComplete: t.isComplete,
  }));

  return {
    props: { tasks }, // will be passed to the page component as props
  };
}
