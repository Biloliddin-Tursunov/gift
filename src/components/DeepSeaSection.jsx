import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import "../styles/DeepSea.css";
import underwaterVideo from "../assets/underwater.mp4";

// --- MEDIA IMPORT ---
const mediaObj = import.meta.glob(
    "../assets/gif/*.{gif,png,jpg,jpeg,mp4,webm}",
    { eager: true }
);
const mediaUrls = Object.values(mediaObj).map((mod) => mod.default);

const getMediaType = (url) => {
    if (!url) return "image";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes(".mp4") || lowerUrl.includes(".webm")) return "video";
    return "image";
};

// --- DATA ---
const LONG_MESSAGES = [
    {
        title: "〈好きなもの〉",
        text: "ウズベキスタンの友達みんな、特別は私の肝臓であり、宇宙人であるBilolidin、昆虫や海洋生物🪼🐙、生き物全部、宇宙人👽、パグ、鶏🐓、食べる事😋、歌ったり踊る事💃、新しい環境に飛び込むこと、空想すること、話す事、ホラーかコメディー映画を見る事、アニメ、人を眺めること、自然、海、スポーツ、ゲーム、楽しい事✨、絵を描く事などなど",
    },
    {
        title: "〈苦手なもの〉",
        text: "失礼や礼義がない人、誰かを平気で傷つける人、生き物を大切にしない人、暴力など🤔",
    },
    {
        title: "〈どんな性格〉",
        text: "基本的にはハッピーな性格、大切な人が傷つけられたら老若男女問わず助けます。基本的に母性愛がつよい。すぐに人を信用してしまいます。",
    },
    {
        title: "〈1日の中で最も多い感情〉",
        text: "基本的にハッピーでいようとします😁せっかくの1日を退屈に過ごすのが嫌で、楽しみを探します😊蝶々を探したり、自然を見るのが好きです！",
    },
    {
        title: "〈もし日本に来たら...〉",
        text: "海を見せたい、サッカーで勝負、パグを撫でてもらう、鬼ごっこをする、木刀を振り回す、鹿公園に来てもらう、ミサンガを交換する、あなたがしたい事や行きたいところへ連れて行く！美味しい料理を食べる😋、遊ぶ！などたくさん!",
    },
    {
        title: "Biloliddin!!!🐙🌙",
        text: "私もあなたと出会えたのは奇跡でご縁を感じました。あなたといると、心地よく、本当の私でいれました。プロジェクトで忙しくても、あなたの笑顔や私の名前を呼んでくれると、全て上手くいく気がしました。",
    },
    {
        title: "Telepathy 😂",
        text: "あなたとは言語は違えど、それを超えるテレパシーがありました😂考えてる事が同じで、どこまでも行けるような気がしました！",
    },
    {
        title: "Memories",
        text: "恋のマイアヒが好きな点や物事の捉え方、2人で生み出した言葉もどれも私にとっての宝物です😊あなたの考えはどれも聞き入るようなテーマで、共に考えるのがとても楽しかったです😌",
    },
    {
        title: "My Alien 👽",
        text: "私はエイリアンや変なおふざけをするのが好きです👽しかしそれを共有できる友達が日本にはあまりいませんでした。あなたは歴史や宇宙、未知の世界が好きで、2人の想像の世界が広がるようで、絵本のような映画のような3週間でした。",
    },
    {
        title: "Thank you ❤️‍🔥",
        text: "お茶目でイタズラ好きなあなたも知的なあなたも両方大好きです！私に笑いかけてくれる時も、目をみつめてお話しに付き合ってくれる時も、とても嬉しかったです。このシルクロードの一期一会で得た私の唯一の肝臓として、絶えることなく連絡してください😊あなたと出会えて私は幸せ者です！また絶対に会いましょう❤️‍🔥👽🛸",
    },
];

const SPECIAL_WORDS = [
    "No translate",
    "Yes translate",
    "Habibi",
    "Jigar",
    "Maia hi Maia huu ♪",
    "Kinder boy",
    "Kind boy",
    "octopus🐙",
    "alien👽",
    "Puku puku puku",
    "Follow me",
    "Follow you",
    "Telepathy",
    "telepatiya",
];

const random = (min, max) => Math.random() * (max - min) + min;
const INTRO_TEXT = "〈あなたとの思い出〉";

const DeepSeaSection = () => {
    const containerRef = useRef(null);
    const bubblesRef = useRef([]);
    const requestRef = useRef();

    // State
    const [elements, setElements] = useState([]);
    const [displayedTitle, setDisplayedTitle] = useState("");
    const [showBubbles, setShowBubbles] = useState(false);

    // Logic Refs
    const typingStartedRef = useRef(false);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    // --- 1. INITIALIZATION ---
    useEffect(() => {
        let allItems = [];
        let idCounter = 0;

        // Long Text
        LONG_MESSAGES.forEach((msg) => {
            allItems.push({
                id: idCounter++,
                // 🔥 SINF NOMI
                className: "long-text",
                type: "text",
                title: msg.title,
                content: msg.text,
                x: random(10, 90),
                y: random(10, 90),
                vx: random(-0.02, 0.02),
                vy: random(-0.02, 0.02),
            });
        });

        // Special Words
        SPECIAL_WORDS.forEach((word) => {
            allItems.push({
                id: idCounter++,
                // 🔥 SINF NOMI
                className: "special-word",
                type: "word",
                content: word,
                x: random(10, 90),
                y: random(10, 90),
                vx: random(-0.03, 0.03),
                vy: random(-0.03, 0.03),
            });
        });

        // Media
        mediaUrls.forEach((url) => {
            allItems.push({
                id: idCounter++,
                // 🔥 SINF NOMI
                className: "media",
                type: "media",
                mediaType: getMediaType(url),
                content: url,
                x: random(10, 90),
                y: random(10, 90),
                vx: random(-0.025, 0.025),
                vy: random(-0.025, 0.025),
            });
        });

        bubblesRef.current = allItems;
    }, []);

    // --- 2. TYPING TITLE ---
    useEffect(() => {
        if (!isInView || typingStartedRef.current) return;
        typingStartedRef.current = true;

        let index = 0;
        const typeChar = () => {
            if (index < INTRO_TEXT.length) {
                setDisplayedTitle((prev) => prev + INTRO_TEXT.charAt(index));
                index++;
                setTimeout(typeChar, 150);
            } else {
                setTimeout(() => {
                    setShowBubbles(true);
                    setElements([...bubblesRef.current]);
                }, 1000);
            }
        };
        typeChar();
    }, [isInView]);

    // --- 3. PHYSICS LOOP ---
    const updatePhysics = () => {
        const bubbles = bubblesRef.current;
        if (!bubbles || bubbles.length === 0) return; // Crash oldini olish

        for (let i = 0; i < bubbles.length; i++) {
            let b = bubbles[i];

            if (b.isHovered) continue;

            b.x += b.vx;
            b.y += b.vy;

            // Devorlar
            if (b.x <= 5 || b.x >= 95) b.vx *= -1;
            if (b.y <= 5 || b.y >= 95) b.vy *= -1;

            if (b.x < 1) b.x = 2;
            if (b.x > 99) b.x = 98;
        }

        bubbles.forEach((b) => {
            const el = document.getElementById(`bubble-${b.id}`);
            if (el) {
                el.style.left = `${b.x}%`;
                el.style.top = `${b.y}%`;
            }
        });

        requestRef.current = requestAnimationFrame(updatePhysics);
    };

    useEffect(() => {
        if (showBubbles) {
            requestRef.current = requestAnimationFrame(updatePhysics);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [showBubbles]);

    // Events
    const handleMouseEnter = (id) => {
        const b = bubblesRef.current.find((item) => item.id === id);
        if (b) b.isHovered = true;
    };
    const handleMouseLeave = (id) => {
        const b = bubblesRef.current.find((item) => item.id === id);
        if (b) b.isHovered = false;
    };

    return (
        <div className="deep-sea-container" ref={containerRef}>
            <video className="background-video" autoPlay loop muted playsInline>
                <source src={underwaterVideo} type="video/mp4" />
            </video>
            <div className="video-overlay"></div>

            {/* Title */}
            {!showBubbles && (
                <div className="intro-typing-title">
                    {displayedTitle}
                    <span className="cursor">|</span>
                </div>
            )}

            {/* Elements */}
            {showBubbles &&
                elements.map((item) => (
                    <div
                        key={item.id}
                        id={`bubble-${item.id}`}
                        // 🔥 To'g'ri klassni qo'llash: special-word, long-text, media
                        className={`telegram-msg ${item.className}`}
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                        }}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={() => handleMouseLeave(item.id)}>
                        {item.type === "media" &&
                            (item.mediaType === "video" ? (
                                <video
                                    src={item.content}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="media-content"
                                />
                            ) : (
                                <img
                                    src={item.content}
                                    alt="media"
                                    className="media-content"
                                />
                            ))}

                        {item.type === "text" && (
                            <>
                                <span className="title-msg">{item.title}</span>
                                <span>{item.content}</span>
                            </>
                        )}

                        {item.type === "word" && <span>{item.content}</span>}
                    </div>
                ))}
        </div>
    );
};

export default DeepSeaSection;
