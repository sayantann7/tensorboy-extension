"use client";
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import FileIcon from '@/components/FileIcon';

export default function Home() {
    const params = useParams();
    const folderId = (params?.folderId ?? '') as string;
    const [wallpaper, setWallpaper] = useState(1);

    const internshipFiles1 = [
        {
            text: "AI Intern",
            url: "",
            icon: "google",
            content: `Ethical Den (Kolkata/Remote Hybrid)

Role : AI Intern
Focus: Image classification, PyTorch/TensorFlow, AI agents
Duration: 3 months
Eligibility: 3rd-year engineering (CSE/ECE/AI/ML)
Stipend: ₹3k–5k/month

Apply: hr@ethicalden.com
            `,
            fileType: "markdown"
        },
        {
            text: "AI Engineer Intern",
            url: "",
            icon: "google",
            content: `RST Ecoenergy Private Limited Ghaziabad

Role : Artificial Intelligence (AI) Intern
Duration: 4 Months
Stipend: ₹10,000-15,000/month

Apply: https://internshala.com/internship/detail/artificial-intelligence-ai-internship-in-ghaziabad-at-rst-ecoenergy-private-limited1749722985
            `,
            fileType: "markdown"
        },
        {
            text: "Data Analytics Intern",
            url: "",
            icon: "google",
            content: `Rolls‑Royce Power Systems

Role : Data Analytics Intern

Apply: https://unstop.com/internships/data-analytics-internship-rolls-royce-1501296
            `,
            fileType: "markdown"
        },
        {
            text: "Junior Data Scientist",
            url: "",
            icon: "google",
            content: `Ethqan Technologies Pvt Ltd, Sreekaryam, Thiruvananthapuram

Role : Junior Data Scientist

Apply: https://in.indeed.com/viewjob?jk=a030073280351894
            `,
            fileType: "markdown"
        },
        {
            text: "Data Engineer Intern",
            url: "",
            icon: "google",
            content: `Low‑Latency Technologies (Remote)

Role : Data Engineer Intern
Duration: 6 months
Eligibility: B.E/B.Tech (IT/CS/E&TC), MCA, M.Sc
Stipend: ₹4,000+/month

Apply: mailto:info@lowlatency.co.in
            `,
            fileType: "markdown"
        },
    ];

    const internshipFiles2 = [
        {
            text: "Angular Developer Intern",
            url: "",
            icon: "google",
            content: `infobahn networks

Role : Angular Developer - Intern

Apply: https://in.indeed.com/viewjob?jk=97c6fedc66463494
            `,
            fileType: "markdown"
        },
        {
            text: "Business Analyst Intern",
            url: "",
            icon: "google",
            content: `Electrovese Solutions Pvt Ltd.

Role : Business Analyst Intern

Apply: https://in.indeed.com/viewjob?jk=ee516b3b4abed5d0
            `,
            fileType: "markdown"
        },
        {
            text: "Software Tester Intern",
            url: "",
            icon: "google",
            content: `Acoustte Digital Services

Role : Software Tester Intern
Stipend: ₹7,000 - ₹10,000/month

Apply: https://in.indeed.com/viewjob?jk=3d505716b25c8701
            `,
            fileType: "markdown"
        },
        {
            text: "QA Intern",
            url: "",
            icon: "google",
            content: `Sawara Solutions Pvt Ltd. (Promilo)

Role : QA Intern
Stipend: ₹5,000/month

Apply: https://in.indeed.com/viewjob?jk=521e382bf1edc8f7
            `,
            fileType: "markdown"
        },
        {
            text: "Digital Marketing Internship",
            url: "",
            icon: "google",
            content: `iCubes

Role : Digital Marketing Internship (SEO)

Apply: https://in.indeed.com/viewjob?jk=af39a3f22bc3de8b
            `,
            fileType: "markdown"
        },
    ];

    const internshipFiles3 = [
        {
            text: "Fresher- Online Bidder",
            url: "",
            icon: "google",
            content: `Zoptal Solutions

Role : Fresher- Online Bidder
Stipend: ₹6,000 - ₹8,000/month

Apply: https://in.indeed.com/viewjob?jk=e7621c244bfb44fe
            `,
            fileType: "markdown"
        },
        {
            text: "E-Commerce Intern",
            url: "",
            icon: "google",
            content: `Bizmet Services Pvt. Ltd.

Role : E-Commerce Intern
Stipend: ₹5,000 - ₹10,000/month

Apply: https://in.indeed.com/viewjob?jk=68c9723f4df499a8
            `,
            fileType: "markdown"
        },
        {
            text: "AI Intern",
            url: "",
            icon: "google",
            content: `Ethical Den (Kolkata/Remote Hybrid)

Role : AI Intern
Focus: Image classification, PyTorch/TensorFlow, AI agents
Duration: 3 months
Eligibility: 3rd-year engineering (CSE/ECE/AI/ML)
Stipend: ₹3k–5k/month

Apply: mailto:hr@ethicalden.com
            `,
            fileType: "markdown"
        }
    ];

    useEffect(() => {
        const storedWallpaper = localStorage.getItem('wallpaperNumber');
        if (storedWallpaper) {
            setWallpaper(Number(storedWallpaper));
        }
    }, []);

    return (
        <div className="relative w-screen min-h-screen overflow-hidden">
            {/* Background layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter grayscale-[50%] brightness-65 contrast-100" style={{ backgroundImage: `url(/wallpapers/${wallpaper}.gif)` }} />
                <div className="absolute inset-0 bg-black/30" />
                <video src="/bg-video.mp4" autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-3" />
            </div>

            <div className="absolute top-12 left-8 z-30">
                <Link href="/"><h1 className="text-white text-2xl pixelated-font">{'<-'} Go Back</h1></Link>
            </div>

            <div className="absolute top-30 left-8 z-30">
                <h1 className="text-white text-5xl pixelated-font">INTERNSHIPS</h1>
            </div>

            <div className="absolute top-1/12 right-8 flex flex-col gap-10 z-30" style={{ whiteSpace: 'pre-wrap' }}>
                {internshipFiles1.map((file, index) => (
                    <FileIcon
                        key={index}
                        text={file.text}
                        url={file.url}
                        icon={file.icon}
                        content={file.content}
                        fileType={file.fileType}
                    />
                ))}
            </div>

            <div className="absolute top-1/12 right-60 flex flex-col gap-10 z-20" style={{ whiteSpace: 'pre-wrap' }}>
                {internshipFiles2.map((file, index) => (
                    <FileIcon
                        key={index}
                        text={file.text}
                        url={file.url}
                        icon={file.icon}
                        content={file.content}
                        fileType={file.fileType}
                    />
                ))}
            </div>

            <div className="absolute top-1/12 right-120 flex flex-col gap-10 z-10" style={{ whiteSpace: 'pre-wrap' }}>
                {internshipFiles3.map((file, index) => (
                    <FileIcon
                        key={index}
                        text={file.text}
                        url={file.url}
                        icon={file.icon}
                        content={file.content}
                        fileType={file.fileType}
                    />
                ))}
            </div>

        </div>
    );
}