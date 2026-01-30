import React, { useEffect, useRef , useState} from 'react';
import Subdiv from './SubDiv';
import Skills from './Skills'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';
import { loadPosts } from './lib/loadPosts';
import { Link } from 'react-router-dom';
import { parsePost } from './lib/parsePost';


type BlogPostPreview = {
    slug: string
    title: string
    date: string
}

const MainPage: React.FC = () => {

    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            event.preventDefault();
            const targetId = (event.currentTarget as HTMLAnchorElement).getAttribute('href')?.substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offset = 50; 
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

        return () => {
            links.forEach(link => {
                link.removeEventListener('click', handleScroll);
            });
        };
    }, []);
    useEffect(() => {
        const options = {
            root: null, 
            rootMargin: '-50px', 
            threshold: 0.5, 
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

    const [posts, setPosts] = useState<BlogPostPreview[]>([])


      
      
    useEffect(() => {
        async function fetchPosts() {
          const rawPosts = await loadPosts()
    
          const parsed = rawPosts.filter(post => post.slug).map(post => {
            const parsed = parsePost(post.raw)
            console.log("HELLO")
            console.log(parsed.title)
            return {
              slug: post.slug!,
              title: parsed.title,
              date: parsed.date
            }
          })
    
          setPosts(parsed)
        }
    
        fetchPosts()
      }, [])

      
    return (
        <>
        <div className="wrapper">
            <div className="sidebar">
                <div>
                    <h2>Sundaresan Karunakaran</h2>
                    <h3>Software Engineer</h3>
                    <h5>With a passion for anything computer</h5>
                </div>
                <img className="nav-link" src='/ProfilePic.jpeg' alt='Sundaresan Karunakaran Photo' style={{borderRadius:'60%', marginTop:'5%', marginLeft:'10%'}} width="300" height="350"/>
                <div style={{display:'flex',flexDirection:'column', padding:'10%'}}>
                    <a href="#introduction"  className="nav-link">
                        <span>About me</span>
                    </a>
                    <a href="#workexperience" className="nav-link"><span>Work Experience</span></a>
                    <a href="#education" className="nav-link"><span>Education</span></a>
                    <a href="#skills"  className="nav-link"><span>Skills</span></a>
                    <a href='#blogs' className='nav-link'><span>Blogs</span></a>

                    <hr style={{width:"100%"}}/>
                    <a href='/resume.pdf' className="nav-link" target="_blank"><span>Resume</span></a>

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
                <hr style={{width:"100%"}}/>
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
                <hr style={{width:"100%"}}/>
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
                <hr style={{width:"100%"}}/>
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
                <hr style={{width:"100%"}}/>
                <div className='blogs' id='blogs' ref={el => sectionRefs.current[4] = el}>
                    <div>
                        <ul className="blog-list">
                            {
                                posts.map(post => {
                                    console.log('Post slug:', post.slug)
                                    return (
                                        <li key={post.slug} className="blog-list-item">
                                            <Link to={`/blog/${post.slug}`} className="blog-link">
                                                {post.title} - {post.date}
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
           </div>
        </div>

        </>
    );
};

export default MainPage;