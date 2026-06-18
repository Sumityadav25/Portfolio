/* ==========================================================================
   PRELOADER TICKER & INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const progressPercent = document.getElementById('preloader-perc');
  const progressBar = document.getElementById('progress-bar');
  const statusLabel = document.getElementById('preloader-status');
  
  const statusMessages = [
    "LOADING SYSTEM MODULES...",
    "CONNECTING TO DATABASE RETRIEVALS...",
    "INITIALIZING STATE HANDLERS...",
    "INDEXING TECHNICAL NODES...",
    "PORTFOLIO READY."
  ];

  let currentPercent = 0;
  
  function updatePreloader() {
    if (currentPercent < 100) {
      currentPercent += Math.floor(Math.random() * 6) + 1;
      if (currentPercent > 100) currentPercent = 100;
      
      progressPercent.textContent = currentPercent.toString().padStart(2, '0');
      progressBar.style.width = currentPercent + '%';
      
      const msgIndex = Math.min(
        Math.floor((currentPercent / 100) * statusMessages.length),
        statusMessages.length - 1
      );
      statusLabel.textContent = statusMessages[msgIndex];
      
      setTimeout(updatePreloader, Math.random() * 30 + 10);
    } else {
      setTimeout(() => {
        preloader.classList.add('loaded');
        initAnimations();
      }, 400);
    }
  }

  updatePreloader();
});

/* ==========================================================================
   GLOBAL SITE MOTION INITIALIZER
   ========================================================================== */
function initAnimations() {
  initNavbarScroll();
  initCustomCursor();
  initShowcaseGlows();
  initMagneticButtons();
  initIntersectionObserver();
  initHeroParallax();
  initSpecClusterFilters();
  initResumeDownloadListeners();
  initContactFormListener();
}

/* ==========================================================================
   NAVBAR SCROLL RESPONSE & MOBILE NAV
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  const mobileLinks = document.querySelectorAll('.mobile-nav-item');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   CUSTOM CURSOR (LERP / INERTIA EFFECT)
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (!cursorDot || !cursorRing) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
  
  function renderCursor() {
    ringX = lerp(ringX, mouseX, 0.15);
    ringY = lerp(ringY, mouseY, 0.15);
    
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states binding
  const hoverLinks = document.querySelectorAll('.cursor-hover-link, a:not(.cursor-hover-scale):not(.cursor-hover-project)');
  const hoverScales = document.querySelectorAll('.cursor-hover-scale, button, .social-icon-btn');
  const hoverProjects = document.querySelectorAll('.cursor-hover-project');

  hoverLinks.forEach(element => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering-link'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering-link'));
  });

  hoverScales.forEach(element => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering-scale'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering-scale'));
  });

  hoverProjects.forEach(element => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering-project'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering-project'));
  });
}

/* ==========================================================================
   SHOWCASE IMAGE INTERACTIVE GLOW COORDINATES
   ========================================================================== */
function initShowcaseGlows() {
  const containers = document.querySelectorAll('.showcase-img-container');
  
  containers.forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   MAGNETIC BUTTONS INTERACTION
   ========================================================================== */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.btn-magnetic');

  if (window.innerWidth > 768) {
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const bounding = element.getBoundingClientRect();
        const center = {
          x: bounding.left + bounding.width / 2,
          y: bounding.top + bounding.height / 2
        };
        
        const distance = {
          x: e.clientX - center.x,
          y: e.clientY - center.y
        };

        const pullFactor = 0.35;
        element.style.transform = `translate(${distance.x * pullFactor}px, ${distance.y * pullFactor}px)`;
        
        const textElement = element.querySelector('span, svg');
        if (textElement) {
          textElement.style.transform = `translate(${distance.x * 0.1}px, ${distance.y * 0.1}px)`;
        }
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
        const textElement = element.querySelector('span, svg');
        if (textElement) {
          textElement.style.transform = 'translate(0px, 0px)';
        }
      });
    });
  }
}

/* ==========================================================================
   INTERSECTION OBSERVER FOR SCROLL REVEALS
   ========================================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   HERO DASHBOARD DRIFT PARALLAX
   ========================================================================== */
function initHeroParallax() {
  const heroSection = document.getElementById('home');
  const dashboard = document.querySelector('.hero-visual-dashboard');

  if (window.innerWidth > 992 && dashboard) {
    heroSection.addEventListener('mousemove', (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const mouseX = e.clientX - w / 2;
      const mouseY = e.clientY - h / 2;
      
      const depth = 0.03;
      const moveX = mouseX * depth;
      const moveY = mouseY * depth;
      
      dashboard.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY * 0.1}deg) rotateY(${moveX * 0.1}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      dashboard.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
    });
  }
}

/* ==========================================================================
   TECHNICAL SPEC INDEX FILTER NODES (WITH MULTI-CATEGORY HIGHLIGHTS)
   ========================================================================== */
function initSpecClusterFilters() {
  const menuButtons = document.querySelectorAll('.specs-menu-btn');
  const specNodes = document.querySelectorAll('.spec-node-tile');
  
  const insightCard = document.getElementById('spec-insight-card');
  const insightTitle = document.getElementById('insight-title');
  const insightDesc = document.getElementById('insight-desc');
  const insightProjRow = document.getElementById('insight-project-row');
  const insightProjVal = document.getElementById('insight-project-val');

  const skillInsights = {
    'RAG (Retrieval-Augmented Gen)': {
      desc: 'Built context-aware document QA systems. Implemented search pipelines retrieving vector chunks to guide model completions.',
      project: 'OpsMind AI SOP Agent'
    },
    'LLM API Integration': {
      desc: 'Integrated OpenAI APIs (GPT models) for resume scoring, cover letter generation, and automated support flows.',
      project: 'CareerForge Pro & Zaalima AI Chatbot'
    },
    'Vector Embeddings': {
      desc: 'Generated dense vector representations of text using text-embedding models, enabling semantic matching beyond keyword search.',
      project: 'OpsMind AI'
    },
    'Prompt Engineering': {
      desc: 'Designed system prompts, few-shot examples, and chain-of-thought instructions to regulate LLM output structure.',
      project: 'CareerForge Pro'
    },
    'Semantic Search': {
      desc: 'Implemented semantic indexing by querying vector databases to return top-k matches with high cosine similarity.',
      project: 'OpsMind AI'
    },
    'JavaScript (ES6+)': {
      desc: 'Core language for all applications. Wrote clean async/await flows, DOM manipulation scripts, and server routing.',
      project: 'All Full-Stack Projects'
    },
    'Java': {
      desc: 'Leveraged for core OOP foundations, data structure architectures, and backend algorithm challenges.',
      project: 'Academic Work & DSA Solutions'
    },
    'React.js': {
      desc: 'Built modern single-page applications with hooks, state managers, custom inputs, and dynamic grids.',
      project: 'CareerForge Pro & EventForge'
    },
    'HTML5': {
      desc: 'Semantic HTML markup structure optimized for web accessibility, modern SEO meta tags, and indexing.',
      project: 'All Web Implementations'
    },
    'CSS3': {
      desc: 'Crafted premium custom grid systems, fluid layout transitions, keyframe animations, and mobile responsive media queries.',
      project: 'All Web Implementations'
    },
    'Node.js': {
      desc: 'Runtime environment for API servers. Handled filesystems, package management, and server environments.',
      project: 'OpsMind AI & Zaalima AI Chatbot'
    },
    'Express.js': {
      desc: 'Set up lightweight RESTful API servers, customized middlewares, CORS configurations, and routing architectures.',
      project: 'CareerForge Pro & EventForge'
    },
    'REST APIs': {
      desc: 'Designed HTTP endpoints handling JSON payloads, authorization headers, status codes, and CRUD database requests.',
      project: 'EventForge & OpsMind AI'
    },
    'JWT Authentication': {
      desc: 'Secured client routes by signing and verifying JSON Web Tokens, implementing role authorization checks.',
      project: 'EventForge'
    },
    'MongoDB Atlas': {
      desc: 'Cloud database platform hosting vector indexes and standard collections with high availability.',
      project: 'OpsMind AI'
    },
    'MongoDB': {
      desc: 'NoSQL database for document storage. Structured flexible schemas for users, events, and chatbot logs.',
      project: 'EventForge & Zaalima AI Chatbot'
    },
    'Vector Search': {
      desc: 'Configured vector search indexes to query multidimensional data spaces using cosine metric similarity.',
      project: 'OpsMind AI'
    },
    'MySQL': {
      desc: 'Relational database schema modeling, writing complex SQL queries, and optimizing indexes.',
      project: 'Database Management Systems Work'
    },
    'OOP': {
      desc: 'Applied object-oriented principles (inheritance, polymorphism, encapsulation) to build scalable software.',
      project: 'Java Backend Architectures'
    },
    'DSA': {
      desc: 'Strong foundation in algorithms and data structures (trees, graphs, sorting, searching) for optimized processing.',
      project: 'Core Engineering Problems'
    },
    'DBMS': {
      desc: 'Modeled database structures, normalization rules, and data access controllers to ensure transactional integrity.',
      project: 'SQL & NoSQL Implementations'
    },
    'Git': {
      desc: 'Version control engine for tracking local code branch changes, rebasing, merging, and conflicts resolution.',
      project: 'Zaalima Development Internship & Personal Work'
    },
    'GitHub': {
      desc: 'Hosted repositories, managed pull requests, collaborated in development teams, and configured deployment actions.',
      project: 'Zaalima Development Pvt. Ltd.'
    },
    'Postman': {
      desc: 'Tested backend API routes, validated JSON payloads, verified headers, and debugged endpoints.',
      project: 'Zaalima Internship Testing'
    },
    'Netlify': {
      desc: 'Configured automated deployment pipelines and environment variables for static frontend hosts.',
      project: 'React Applications Hosting'
    },
    'Render': {
      desc: 'Deployed running instances of Node/Express backend APIs with environment variables and log monitoring.',
      project: 'Live API Hosting'
    }
  };

  function updateInsightCard(tileText) {
    if (!insightCard || !insightTitle || !insightDesc) return;
    const key = tileText.trim();
    const insight = skillInsights[key];
    
    // Fade out
    insightTitle.style.opacity = '0';
    insightDesc.style.opacity = '0';
    if (insightProjRow) insightProjRow.style.opacity = '0';
    
    setTimeout(() => {
      if (insight) {
        insightTitle.textContent = key;
        insightDesc.textContent = insight.desc;
        if (insightProjVal) insightProjVal.textContent = insight.project;
        if (insightProjRow) {
          insightProjRow.style.opacity = '1';
          insightProjRow.style.display = 'flex';
        }
        insightCard.classList.add('active-glow');
      } else {
        insightTitle.textContent = "Click a technology tile";
        insightDesc.textContent = "Select any technology tile in the matrix to see its specific application, project implementation, and technical depth.";
        if (insightProjRow) {
          insightProjRow.style.opacity = '0';
        }
        insightCard.classList.remove('active-glow');
      }
      
      // Fade in
      insightTitle.style.opacity = '1';
      insightDesc.style.opacity = '1';
    }, 200);
  }

  // Add click listener for tiles
  specNodes.forEach(node => {
    node.addEventListener('click', () => {
      // Active visual state for selected tile
      specNodes.forEach(n => n.classList.remove('active-tile-select'));
      node.classList.add('active-tile-select');
      
      updateInsightCard(node.textContent);
    });
    
    node.addEventListener('mouseenter', () => {
      if (!node.classList.contains('dimmed')) {
        node.style.borderColor = 'rgba(0, 242, 254, 0.4)';
      }
    });
    node.addEventListener('mouseleave', () => {
      node.style.borderColor = '';
    });
  });

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      specNodes.forEach(node => {
        node.className = 'spec-node-tile cursor-hover-scale';
        
        if (category === 'all') {
          return;
        }

        const nodeGroup = node.getAttribute('data-node');
        const groups = nodeGroup.split(',');
        if (groups.includes(category)) {
          node.classList.add(`highlight-${category}`);
        } else {
          node.classList.add('dimmed');
        }
      });
      
      // Reset card details on category change
      updateInsightCard("");
      specNodes.forEach(n => n.classList.remove('active-tile-select'));
    });
  });
}

/* ==========================================================================
   RESUME SPEC SHEET DOWNLOAD HANDLER
   ========================================================================== */
function initResumeDownloadListeners() {
  const downloadBtn = document.getElementById('hero-download-resume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const resumeText = `SUMIT KUMAR YADAV
Software Developer | MERN Stack Developer | AI Integration Specialist
Location: Bhopal, India | Email: r.sumityadavdev@gmail.com | Phone: +918815172529

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
Computer Science undergraduate with hands-on experience in Full Stack Development
and AI-powered applications. Skilled in MERN Stack, REST APIs, MongoDB, 
and RAG-based systems, with experience integrating Generative AI into real-world 
solutions. Eager to apply technical skills in professional environments.

--------------------------------------------------------------------------------
EDUCATION
* Bachelor of Technology (B.Tech) - Computer Science & Engineering (2022 - 2026)
  Sagar Institute of Research and Technology, Bhopal
  CGPA: 7.17 (Till 7th Semester)

* XII (Higher Secondary) - MPBSE (2021)
  Vivekananda Vidhyapeeth, Bhopal
  Percentage: 85%

* X (Secondary) - MPBSE (2019)
  Vivekananda Vidhyapeeth, Bhopal
  Percentage: 84%

--------------------------------------------------------------------------------
WORK EXPERIENCE
Software Development Intern & Team Leader
Zaalima Development Pvt. Ltd. (Nov 2025 - Feb 2026)
* Led a development team to deliver 5+ features across 3 agile sprints, 
  improving overall speed by 20%.
* Contributed to the development of AI-powered applications, including 
  RAG-based systems and resume optimization platforms.
* Conducted code reviews, performed API testing, and managed version control 
  using Git and GitHub.

Web Development Intern (AICTE OIB-SIP)
Oasis Infobyte (Jun 2025 - Jul 2025)
* Awarded Appreciation Certificate and Letter of Recommendation for outstanding performance.
* Designed and developed responsive frontend components using HTML, CSS, and JavaScript.
* Completed internship roadmap tasks on time, maintaining clean and documented code.

--------------------------------------------------------------------------------
PROJECTS
1. OpsMind AI: Enterprise SOP Agent (RAG-Based GenAI System)
   * Built a RAG-based system for semantic search across 500+ pages of SOPs.
   * Implemented vector embeddings to provide contextual, document-aware answers.
   * Connected RESTful routes between frontend and backend services.
   * Integrated MongoDB Atlas Vector Search for scalable document indexing.

2. CareerForge Pro
   * Designed an ATS Resume Optimizer and AI Career Assistant to match candidates
     to target requirements.

3. Event Management System (MERN Stack)
   * Designed a full-stack college event discovery and registration portal.
   * Implemented secure JWT role authentication.
   * Integrated UPI payment checking mechanism, boosting registration index by 20%.

4. Zaalima AI Chatbot
   * Built an intelligent customer support chatbot to automate query processing.
   * Leveraged OpenAI APIs and MongoDB for context-aware customer routing.

--------------------------------------------------------------------------------
SKILLS
* Programming Languages: Java, JavaScript (ES6+)
* Web Technologies: HTML, CSS, React.js, Node.js, Express.js
* AI & GenAI: LLM Integration, Prompt Engineering, RAG (Retrieval-Augmented Gen)
* Databases & Cloud: MongoDB Atlas, MongoDB, Vector Search, MySQL, Netlify, Render
* Developer Tools: Git, GitHub, Postman, CLI
* Core Concepts: OOP, DSA, DBMS, REST APIs

--------------------------------------------------------------------------------
CERTIFICATIONS & ACHIEVEMENTS
* Web Development Training - Zaalima Development (Nov 2025 - Feb 2026)
* AICTE OIB-SIP Web Development Internship (Jun 2025 - Jul 2025)
`;

      const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'Sumit_Kumar_Yadav_Resume.txt';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}

/* ==========================================================================
   CONTACT FORM DISPATCH SIMULATION
   ========================================================================== */
function initContactFormListener() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submit-btn');
      const statusMsg = document.getElementById('form-status');
      const originalContent = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;
      
      fetch('https://formsubmit.co/ajax/r.sumityadavdev@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message
        })
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.innerHTML = '<span>Message Sent</span>';
        statusMsg.className = 'form-status-msg success';
        statusMsg.style.display = 'block';
        statusMsg.textContent = 'Message sent successfully! Sumit Kumar Yadav will contact you shortly.';
        
        form.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          statusMsg.style.display = 'none';
        }, 5000);
      })
      .catch(error => {
        console.error('Error sending message:', error);
        submitBtn.innerHTML = '<span>Error Occurred</span>';
        statusMsg.className = 'form-status-msg error';
        statusMsg.style.display = 'block';
        statusMsg.textContent = 'Failed to dispatch email. Please email direct: r.sumityadavdev@gmail.com';
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
        }, 5000);
      });
    });
  }
}
