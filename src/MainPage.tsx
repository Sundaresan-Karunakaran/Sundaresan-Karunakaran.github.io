import React, { useEffect, useRef } from 'react';
import Subdiv from './SubDiv';
import Skills from './Skills'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';
    
const MainPage: React.FC = () => {

    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            event.preventDefault();
            const targetId = (event.target as HTMLAnchorElement).getAttribute('href')?.substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offset = 50; // Adjust the offset as needed
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                    });
                }
            }
        };

        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', handleScroll);
        });

        // Cleanup event listeners on component unmount
        return () => {
            links.forEach(link => {
                link.removeEventListener('click', handleScroll);
            });
        };
    }, []);
    useEffect(() => {
        const options = {
            root: null, // relative to the viewport
            rootMargin: '-50px', // margin around the root
            threshold: 0.5, // percentage of the target's visibility
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                const linkElement = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (entry.isIntersecting && linkElement) {
                    linkElement.classList.add('active');
                } else if (linkElement) {
                    linkElement.classList.remove('active');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, options);
        sectionRefs.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => {
            if (observer) {
                sectionRefs.current.forEach(section => {
                    if (section) observer.unobserve(section);
                });
            }
        };
    }, []);
    return (
        <>
        <div className="wrapper">
            <div className="sidebar">
                <div>
                    <h2>Sundaresan Karunakaran</h2>
                    <h3>Software Engineer</h3>
                    <h5>With a passion for anything computer</h5>
                </div>
                <img className="nav-link" src='public/IMG_20240808_111841_731.jpg' alt='Sundaresan Karunakaran Photo' style={{borderRadius:'30%', paddingTop:'10%'}} width="300" height="400"/>
                <div style={{display:'flex',flexDirection:'column', padding:'10%'}}>
                    <a href="#introduction"  className="nav-link">About me</a>
                    <a href="#workexperience" className="nav-link">Work Experience</a>
                    <a href="#education" className="nav-link">Education</a>
                    <a href="#skills"  className="nav-link">Skills</a>

                </div>
                <div style={{display:'flex',width:'30%',bottom:"50px",justifyContent:'space-evenly'}}>
                    <a href='https://github.com/Sundaresan-Karunakaran' className="icon" target="_blank"><GitHubIcon /></a>
                    <a href='https://www.linkedin.com/in/sundaresan-k-701465202/' className="icon" target="_blank"><LinkedInIcon /></a>
                    <a href='mailto:karuns@usi.ch' className="icon" target="_blank"><MailIcon /></a>
                    
                    
                </div>
            </div>
            <div className="main" >
                <div className="introduction" id="introduction" ref={el => sectionRefs.current[0] = el}>
                    Passionate about designing innovative tech solutions, I enjoy diving into software architecture and data flow, ensuring every component works seamlessly together. My journey in technology has ranged from developing embedded systems to creating comprehensive web applications, thriving on turning complex challenges into elegant solutions. Currently, the exploration of cloud computing and formal verification excites me, and I am eager to contribute to cutting-edge projects that push the boundaries of what's possible in tech.
                </div>
                <br />
                <div className='workexperience' id='workexperience' ref={el => sectionRefs.current[1] = el}>
                    <div className='experience'>
                        <Subdiv info={{
                                from: '10/2024',
                                to: '03/2025',
                                position: 'Intern ',
                                company: 'Rescale Consulting GmbH',
                                link: 'https://rescale.ch/',
                                text: "I developed scripts using NestJS to efficiently scrape and extract data from the web. Additionally, I configured and optimized MongoDB databases to store and structure the collected data meaningfully, ensuring seamless retrieval and usability."
                            }} ></Subdiv>
                    </div>
                    <div className='experience'>
                        <Subdiv info={{
                                from: '06/2023',
                                to: '01/2024',
                                position: 'Software Engineer',
                                company: 'Phoenix Medical Systems',
                                link: 'https://www.phoenixmedicalsystems.com/',
                                text: "My experience includes full stack web application development, where I have built and maintained dynamic web solutions. I’ve also developed human-machine interfaces (HMIs) for medical products, enhancing user interaction with technology. Additionally, I've been involved in maintaining R&D servers and assisting with automation testing to ensure robust and reliable system performance."
                            }} ></Subdiv>
                    </div>
                    <div className='experience'>
                        <Subdiv info={{
                                from: '08/2022',
                                to: '05/2023',
                                position: 'Software Development Intern',
                                company: 'Phoenix Medical Systems',
                                link: 'https://www.phoenixmedicalsystems.com/',
                                text: "During my internship, I focused on developing human-machine interfaces (HMIs) for medical products, enhancing the interaction between users and technology. I also assisted with server-side issues, contributing to the smooth operation and reliability of backend systems."
                            }} ></Subdiv>
                    </div>
                </div>
                <br />
                <div className='education' id='education' ref={el => sectionRefs.current[2] = el}>
                    <div className='experience'>
                        <Subdiv info={{
                                from: '02/2024',
                                to: 'Present',
                                position: 'Master of Science in Informatics',
                                company: 'Università della Svizzera italiana',
                                link: 'https://www.inf.usi.ch/en',
                                text: ""
                            }} ></Subdiv>
                    </div>
                    <div className='experience'>
                        <Subdiv info={{
                                from: '2029',
                                to: '2023',
                                position: 'Bachelor of Technology in Electronics and Communication Engineering',
                                company: 'Vellore Institute of Technology',
                                link: 'https://chennai.vit.ac.in/',
                                text: ""
                            }} ></Subdiv>
                    </div>
                </div>
                <br />
                <div className='skills' id='skills' ref={el => sectionRefs.current[3] = el}
                style={{display:'flex',flexDirection: 'row',alignItems: 'center',flexWrap: 'wrap',gap: '23px', justifyContent:'space-evenly'}}>
                    <Skills text='React'></Skills>
                    <Skills text='TypeScript'></Skills>
                    <Skills text='JavaScript'></Skills>
                    <Skills text='React Library'></Skills>
                    <Skills text='Full stack development'></Skills>
                    <Skills text='Flask'></Skills>
                    <Skills text='Python'></Skills>
                    <Skills text='C++'></Skills>    
                    <Skills text='QT'></Skills>
                    <Skills text='Linux'></Skills>
                    <Skills text='Custom Linux OS Development'></Skills>
                    <Skills text='Bash/Shell'></Skills>
                    <Skills text='Git'></Skills>
                </div>
           </div>
        </div>

        </>
    );
};

export default MainPage;