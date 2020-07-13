import fetch from "isomorphic-fetch";
import Error from "next/error";
import StoryList from "../components/StoryList";
import Layout from "../components/Layout";
import Link from "next/link";
import React, { useEffect } from "react";

const Index = (props) => {
    const { stories, page } = props;

    if (stories.length === 0) {
        return <Error statusCode={503} />;
    }

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {
                    console.log(
                        "service worker registration successful",
                        registration
                    );
                })
                .catch((err) => {
                    console.warn(
                        "Service worker registration failed",
                        err.message
                    );
                });
        }
    }, []);

    return (
        <Layout
            title="Hacker Next"
            description="A Hacker News close made with Next.js"
        >
            <StoryList stories={stories} />
            <footer>
                <Link href={`/?page=${page + 1}`}>
                    <a>Next Page ({page + 1})</a>
                </Link>
            </footer>
            <style jsx>
                {`
                    footer {
                        padding: 1em;
                    }
                    footer a {
                        font-weight: bold;
                        color: black;
                        text-decoration: none;
                    }
                `}
            </style>
        </Layout>
    );
};
// req, res and query comes from context/ctx
Index.getInitialProps = async ({ req, res, query }) => {
    let stories;
    let page;

    try {
        page = Number(query.page) || 1;
        const response = await fetch(
            `https://node-hnapi.herokuapp.com/news?page=${page}`
        );
        stories = await response.json();
    } catch (err) {
        console.log(err);
        stories = [];
    }

    return { page, stories };
};

export default Index;
